from __future__ import annotations
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.pair import Pair

class PairRepository(BaseRepository[Pair]):
    """Repository class handling data queries for asset Pairs."""
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Pair, db)

    async def get_by_slug(self, slug: str) -> Optional[Pair]:
        """Resolves a pair by its slug (e.g. 'eurusd')."""
        query = select(Pair).where(Pair.slug == slug.lower())
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_symbol(self, symbol: str) -> Optional[Pair]:
        """Resolves a pair by its symbol (e.g. 'EUR/USD')."""
        query = select(Pair).where(Pair.symbol == symbol.upper())
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_active_pairs(self, category: Optional[str] = None) -> List[Pair]:
        """Fetches active pairs, optionally filtered by asset class/category."""
        query = select(Pair).where(Pair.is_active == True)
        if category:
            query = query.where(Pair.category == category)
        query = query.order_by(Pair.display_order.asc(), Pair.symbol.asc())
        result = await self.db.execute(query)
        return list(result.scalars().all())
