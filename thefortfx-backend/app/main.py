import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import get_settings
from app.core.database import init_db, close_db
from app.core.redis import init_redis, close_redis
from app.core.logging import setup_logging, get_logger
from app.core.middleware import RequestIDMiddleware, TimingMiddleware, RateLimitMiddleware
from app.core.exceptions import register_exception_handlers
from app.api.v1.router import api_router

logger = get_logger("app.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    setup_logging()
    logger.info("Starting up backend application...")
    
    # Initialize DB & Redis
    await init_db()
    await init_redis()
    logger.info("Startup complete.")
    
    yield
    
    # Shutdown
    logger.info("Shutting down backend application...")
    await close_db()
    await close_redis()
    logger.info("Shutdown complete.")

def create_app() -> FastAPI:
    settings = get_settings()
    
    # Sentry integration
    if settings.SENTRY_DSN:
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            environment=settings.APP_ENV,
            traces_sample_rate=1.0 if settings.APP_ENV == "development" else 0.1,
        )
        
    app = FastAPI(
        title="TheFortFX API",
        version="1.0.0",
        description="AI-powered forex intelligence platform",
        lifespan=lifespan,
    )
    
    # Add CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Custom middlewares
    app.add_middleware(RateLimitMiddleware)
    app.add_middleware(TimingMiddleware)
    app.add_middleware(RequestIDMiddleware)
    
    # Exception handlers
    register_exception_handlers(app)
    
    # Router inclusion
    app.include_router(api_router, prefix="/api/v1")
    
    return app

app = create_app()
