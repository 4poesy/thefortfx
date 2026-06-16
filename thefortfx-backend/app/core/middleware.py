from __future__ import annotations
import time
import uuid
import structlog
from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import get_settings
from app.core.logging import get_logger
from app.core.redis import redis_client

logger = get_logger("app.middleware")

class RequestIDMiddleware(BaseHTTPMiddleware):
    """Middleware to generate and bind a unique Request ID for structural logging and tracing."""
    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        
        # Bind request_id to structlog context
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(request_id=request_id)
        
        # Save to request state
        request.state.request_id = request_id
        
        response: Response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response

class TimingMiddleware(BaseHTTPMiddleware):
    """Middleware to measure processing time for each request."""
    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.time()
        response: Response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = f"{process_time:.4f}s"
        return response

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Middleware implementing a sliding window rate limiter via Redis."""
    async def dispatch(self, request: Request, call_next) -> Response:
        settings = get_settings()
        
        # Skip rate limit if redis is not connected or active
        if not redis_client.redis:
            return await call_next(request)
            
        client_ip = request.client.host if request.client else "127.0.0.1"
        path = request.url.path
        
        # Bypass rate limit for OpenAPI doc endpoints
        if path.startswith("/docs") or path.startswith("/openapi.json") or path.startswith("/redoc"):
            return await call_next(request)
            
        # Determine endpoints and limits
        is_auth = path.startswith("/api/v1/auth")
        limit = settings.RATE_LIMIT_AUTH_PER_MINUTE if is_auth else settings.RATE_LIMIT_PER_MINUTE
        key = f"rate_limit:{'auth:' if is_auth else ''}{client_ip}"
        
        now = time.time()
        clear_before = now - 60
        
        try:
            # Redis sorted set sliding window transaction
            pipe = redis_client.redis.pipeline()
            pipe.zadd(key, {str(now): now})
            pipe.zremrangebyscore(key, "-inf", clear_before)
            pipe.zcard(key)
            pipe.expire(key, 60)
            results = await pipe.execute()
            
            # zcard index is 2
            request_count = results[2]
            
            if request_count > limit:
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "success": False,
                        "error": "Rate Limit Exceeded",
                        "detail": f"Too many requests. Limit is {limit} per minute.",
                        "code": "RATE_LIMIT_EXCEEDED"
                    }
                )
        except Exception as e:
            logger.error(f"Rate limiting failed for IP {client_ip}: {e}")
            
        return await call_next(request)
