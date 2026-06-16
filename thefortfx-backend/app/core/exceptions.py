from __future__ import annotations
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

class AppException(Exception):
    """Base exception class for all custom application errors."""
    def __init__(self, status_code: int, error: str, detail: str, code: str) -> None:
        self.status_code = status_code
        self.error = error
        self.detail = detail
        self.code = code
        super().__init__(detail)

class NotFoundException(AppException):
    def __init__(self, detail: str = "Resource not found", code: str = "NOT_FOUND") -> None:
        super().__init__(status.HTTP_404_NOT_FOUND, "Not Found", detail, code)

class ForbiddenException(AppException):
    def __init__(self, detail: str = "Permission denied", code: str = "FORBIDDEN") -> None:
        super().__init__(status.HTTP_403_FORBIDDEN, "Forbidden", detail, code)

class BadRequestException(AppException):
    def __init__(self, detail: str = "Bad request", code: str = "BAD_REQUEST") -> None:
        super().__init__(status.HTTP_400_BAD_REQUEST, "Bad Request", detail, code)

class RateLimitException(AppException):
    def __init__(self, detail: str = "Too many requests", code: str = "RATE_LIMIT_EXCEEDED") -> None:
        super().__init__(status.HTTP_429_TOO_MANY_REQUESTS, "Too Many Requests", detail, code)

def register_exception_handlers(app: FastAPI) -> None:
    """Registers exception handlers on the FastAPI application."""
    
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": exc.error,
                "detail": exc.detail,
                "code": exc.code
            }
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        errors = exc.errors()
        # Create a readable summary of validation errors
        detail_msg = "; ".join([f"{'.'.join(str(loc) for loc in err['loc'])}: {err['msg']}" for err in errors])
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False,
                "error": "Validation Error",
                "detail": detail_msg,
                "code": "VALIDATION_ERROR"
            }
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        from app.core.logging import get_logger
        logger = get_logger("app.exceptions")
        logger.exception("An unhandled exception occurred", error=str(exc))
        
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": "Internal Server Error",
                "detail": "An unexpected error occurred on the server.",
                "code": "INTERNAL_SERVER_ERROR"
            }
        )
