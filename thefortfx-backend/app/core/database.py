from __future__ import annotations
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.config import get_settings
from app.core.logging import get_logger

logger = get_logger("app.core.database")
settings = get_settings()

# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    echo=settings.DEBUG,
    future=True,
)

# Async session maker
SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

class Base(DeclarativeBase):
    """Base declarative class for all ORM models."""
    pass

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency generator to yield an AsyncSession with automatic commit/rollback."""
    async with SessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            logger.error(f"Database session error, rolling back: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()

async def init_db() -> None:
    """Initializes and verifies the database connection."""
    logger.info("Initializing database connection...")
    try:
        async with engine.connect() as conn:
            await conn.execute("SELECT 1")
        logger.info("Database connection verified successfully.")
    except Exception as e:
        logger.error(f"Failed to connect to the database: {e}")
        raise e

async def close_db() -> None:
    """Closes all database connections."""
    logger.info("Closing database connections...")
    await engine.dispose()
    logger.info("Database connections closed.")
