from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.user import Profile

class UserRepository(BaseRepository[Profile]):
    """Repository class handling data queries for User Profiles."""
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Profile, db)

    async def get_by_email(self, email: str) -> Optional[Profile]:
        """Resolves a profile by email address."""
        query = select(Profile).where(Profile.email == email)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id: uuid.UUID) -> Optional[Profile]:
        """Resolves a profile by its UUID."""
        return await self.get(user_id)

    async def update_last_seen(self, user_id: uuid.UUID) -> None:
        """Updates the last_seen_at timestamp for a profile."""
        query = (
            update(Profile)
            .where(Profile.id == user_id)
            .values(last_seen_at=datetime.utcnow())
        )
        await self.db.execute(query)
        await self.db.flush()

    async def get_all_users(
        self,
        skip: int = 0,
        limit: int = 20,
        role_filter: Optional[str] = None
    ) -> Tuple[List[Profile], int]:
        """Fetches a list of all users, filtered by role (admin panel helper)."""
        filters = {}
        if role_filter:
            filters["role"] = role_filter
        return await self.get_multi(skip=skip, limit=limit, filters=filters, order_by="-created_at")
