from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.opportunity import Opportunity
from app.models.pair import Pair

class OpportunityRepository(BaseRepository[Opportunity]):
    """Repository class handling data queries for opportunities."""
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Opportunity, db)

    async def get_ranked(
        self,
        *,
        direction: Optional[str] = None,
        news_risk: Optional[str] = None,
        category: Optional[str] = None,
        limit: int = 20
    ) -> List[Opportunity]:
        """Fetches active opportunities sorted by final score descending."""
        now = datetime.utcnow()
        query = (
            select(Opportunity)
            .join(Pair)
            .where(Opportunity.valid_until > now)
        )
        
        if direction:
            query = query.where(Opportunity.direction == direction)
        if news_risk:
            query = query.where(Opportunity.news_risk == news_risk)
        if category:
            query = query.where(Pair.category == category)
            
        query = (
            query.options(selectinload(Opportunity.pair), selectinload(Opportunity.signal))
            .order_by(Opportunity.opportunity_score.desc())
            .limit(limit)
        )
        
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_top(self, limit: int = 10) -> List[Opportunity]:
        """Gets the top 10 calculated opportunities."""
        now = datetime.utcnow()
        query = (
            select(Opportunity)
            .where(Opportunity.is_top == True)
            .where(Opportunity.valid_until > now)
            .options(selectinload(Opportunity.pair), selectinload(Opportunity.signal))
            .order_by(Opportunity.opportunity_score.desc())
            .limit(limit)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_pair_slug(self, slug: str) -> Optional[Opportunity]:
        """Gets the latest calculated opportunity for a pair by slug."""
        now = datetime.utcnow()
        query = (
            select(Opportunity)
            .join(Pair)
            .where(Pair.slug == slug.lower())
            .where(Opportunity.valid_until > now)
            .options(selectinload(Opportunity.pair), selectinload(Opportunity.signal))
            .order_by(Opportunity.calculated_at.desc())
            .limit(1)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def bulk_upsert(self, opportunities_data: List[dict]) -> None:
        """Atomically replaces all old opportunities with newly calculated ones."""
        await self.db.execute(delete(Opportunity))
        
        for data in opportunities_data:
            opp = Opportunity(**data)
            self.db.add(opp)
            
        await self.db.flush()
