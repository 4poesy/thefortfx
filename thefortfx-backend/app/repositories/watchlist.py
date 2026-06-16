from __future__ import annotations
import uuid
from typing import List, Optional
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from app.repositories.base import BaseRepository
from app.models.watchlist import Watchlist
from app.models.pair import Pair

class WatchlistRepository(BaseRepository[Watchlist]):
    """Repository class handling data queries for watchlists."""
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Watchlist, db)

    async def get_user_watchlist(self, user_id: uuid.UUID) -> List[Watchlist]:
        """Gets a user's watchlist items along with nested Pair properties and signals."""
        query = (
            select(Watchlist)
            .where(Watchlist.user_id == user_id)
            .options(
                joinedload(Watchlist.pair).joinedload(Pair.signals)
            )
        )
        result = await self.db.execute(query)
        return list(result.scalars().unique().all())

    async def add_pair(self, user_id: uuid.UUID, pair_id: uuid.UUID) -> Watchlist:
        """Adds a pair to the user's watchlist."""
        db_obj = Watchlist(user_id=user_id, pair_id=pair_id)
        self.db.add(db_obj)
        await self.db.flush()
        return db_obj

    async def remove_pair(self, user_id: uuid.UUID, pair_slug: str) -> bool:
        """Removes a pair from the user's watchlist by its slug."""
        pair_query = select(Pair.id).where(Pair.slug == pair_slug.lower())
        pair_result = await self.db.execute(pair_query)
        pair_id = pair_result.scalar_one_or_none()
        
        if not pair_id:
            return False
            
        delete_query = (
            delete(Watchlist)
            .where(Watchlist.user_id == user_id)
            .where(Watchlist.pair_id == pair_id)
        )
        result = await self.db.execute(delete_query)
        await self.db.flush()
        return result.rowcount > 0

    async def is_watching(self, user_id: uuid.UUID, pair_id: uuid.UUID) -> bool:
        """Checks if a user is currently watching a specific pair."""
        query = (
            select(Watchlist.id)
            .where(Watchlist.user_id == user_id)
            .where(Watchlist.pair_id == pair_id)
            .limit(1)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none() is not None
