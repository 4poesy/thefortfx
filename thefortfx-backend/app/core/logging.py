from __future__ import annotations
import logging
import sys
import structlog
from typing import Any

from app.config import get_settings

settings = get_settings()

def setup_logging() -> None:
    """Configures structural logging using structlog with stdlib integration."""
    
    # Configure the standard logging root logger
    logging.basicConfig(
        level=logging.INFO if not settings.DEBUG else logging.DEBUG,
        format="%(message)s",
        stream=sys.stdout,
    )
    
    shared_processors = [
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
    ]

    if settings.APP_ENV == "production":
        # Production JSON logging
        processors = shared_processors + [
            structlog.processors.dict_tracebacks,
            structlog.processors.JSONRenderer()
        ]
    else:
        # Development console logging
        processors = shared_processors + [
            structlog.dev.ConsoleRenderer()
        ]

    structlog.configure(
        processors=processors,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

def get_logger(name: str) -> Any:
    """Returns a structlog bound logger."""
    return structlog.get_logger(name)
