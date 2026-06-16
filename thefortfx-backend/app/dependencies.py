from __future__ import annotations
from typing import Optional
from fastapi import Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis

from app.core.database import get_session
from app.core.redis import redis_client
from app.core.security import get_current_user as security_get_current_user, get_current_user_optional as security_get_current_user_optional
from app.models.user import Profile

async def get_db() -> AsyncSession:
    """Yields an active database session for requests."""
    async for session in get_session():
        yield session

def get_redis() -> Redis:
    """Returns the global Redis client instance."""
    return redis_client

async def get_current_user(
    user: Profile = Depends(security_get_current_user)
) -> Profile:
    """FastAPI dependency to get the current authenticated user Profile."""
    return user

async def get_current_user_optional(
    user: Optional[Profile] = Depends(security_get_current_user_optional)
) -> Optional[Profile]:
    """FastAPI dependency to get the current user Profile if authenticated, else None."""
    return user

class PaginationParams:
    """Pagination parameters dependency."""
    def __init__(
        self,
        page: int = Query(1, ge=1, description="Page number starting from 1"),
        limit: int = Query(20, ge=1, le=100, description="Number of items per page (max 100)")
    ):
        self.page = page
        self.limit = limit
