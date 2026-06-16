from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.forecast import Forecast
from app.models.pair import Pair

class ForecastRepository(BaseRepository[Forecast]):
    """Repository class handling data queries for forecasts."""
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Forecast, db)

    async def get_latest_by_pair(self, pair_id: uuid.UUID, timeframe: str = "daily") -> Optional[Forecast]:
        """Gets the latest active forecast for a pair by UUID and timeframe."""
        now = datetime.utcnow()
        query = (
            select(Forecast)
            .where(Forecast.pair_id == pair_id)
            .where(Forecast.timeframe == timeframe)
            .where(Forecast.valid_until > now)
            .order_by(Forecast.created_at.desc())
            .limit(1)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_pair_slug(self, slug: str, timeframe: str = "daily") -> Optional[Forecast]:
        """Gets the latest active forecast for a pair by slug and timeframe."""
        now = datetime.utcnow()
        query = (
            select(Forecast)
            .join(Pair)
            .where(Pair.slug == slug.lower())
            .where(Forecast.timeframe == timeframe)
            .where(Forecast.valid_until > now)
            .options(selectinload(Forecast.pair))
            .order_by(Forecast.created_at.desc())
            .limit(1)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_all_latest(
        self,
        *,
        trend: Optional[str] = None,
        timeframe: str = "daily",
        category: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> Tuple[List[Forecast], int]:
        """Fetches active forecasts with dynamic filtering and page pagination."""
        now = datetime.utcnow()
        query = (
            select(Forecast)
            .join(Pair)
            .where(Forecast.timeframe == timeframe)
            .where(Forecast.valid_until > now)
        )
        
        if trend:
            query = query.where(Forecast.trend == trend)
        if category:
            query = query.where(Pair.category == category)
            
        # Count total records matching filters
        count_query = select(func.count()).select_from(query.subquery())
        count_result = await self.db.execute(count_query)
        total_count = count_result.scalar_one()
        
        # Load related pair data
        query = query.options(selectinload(Forecast.pair))
        query = query.order_by(Forecast.created_at.desc()).offset(skip).limit(limit)
        
        result = await self.db.execute(query)
        items = list(result.scalars().all())
        
        return items, total_count
