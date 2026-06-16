from __future__ import annotations
import uuid
import hashlib
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
import orjson

from app.config import get_settings
from app.core.redis import redis_client
from app.repositories.forecast import ForecastRepository
from app.repositories.pair import PairRepository
from app.models.forecast import Forecast

settings = get_settings()

class ForecastService:
    """Service layer coordinating Forecast data transactions and cache validations."""
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = ForecastRepository(db)
        self.pair_repo = PairRepository(db)

    def _hash_filters(self, filters: dict, skip: int, limit: int) -> str:
        """Helper to hash query options deterministically."""
        data = {"filters": filters, "skip": skip, "limit": limit}
        serialized = orjson.dumps(data, option=orjson.OPT_SORT_KEYS)
        return hashlib.md5(serialized).hexdigest()

    async def get_all_forecasts(
        self,
        *,
        trend: Optional[str] = None,
        timeframe: str = "daily",
        category: Optional[str] = None,
        page: int = 1,
        limit: int = 20
    ) -> Tuple[List[Forecast], int]:
        """Gets active forecasts from cache if hit, otherwise fetches from DB and populates cache."""
        skip = (page - 1) * limit
        filters = {
            "trend": trend,
            "timeframe": timeframe,
            "category": category
        }
        
        cache_hash = self._hash_filters(filters, skip, limit)
        cache_key = f"forecasts:list:{cache_hash}"
        
        cached = await redis_client.get_cached(cache_key)
        if cached:
            from app.models.pair import Pair
            items = []
            for item in cached["items"]:
                pair_data = item.pop("pair", None)
                fc = Forecast(**item)
                if pair_data:
                    fc.pair = Pair(**pair_data)
                items.append(fc)
            return items, cached["total"]
            
        items, total = await self.repo.get_all_latest(
            trend=trend,
            timeframe=timeframe,
            category=category,
            skip=skip,
            limit=limit
        )
        
        # Cache results (1 hour TTL)
        serialized_items = []
        for item in items:
            d = {c.name: getattr(item, c.name) for c in item.__table__.columns}
            # Ensure float conversion for decimals
            d["support_levels"] = [float(lvl) for lvl in item.support_levels]
            d["resistance_levels"] = [float(lvl) for lvl in item.resistance_levels]
            if item.pair:
                d["pair"] = {c.name: getattr(item.pair, c.name) for c in item.pair.__table__.columns}
            serialized_items.append(d)
            
        await redis_client.set_cached(
            cache_key,
            {"items": serialized_items, "total": total},
            ttl=settings.REDIS_CACHE_TTL_FORECASTS
        )
        
        return items, total

    async def get_forecast_by_slug(self, slug: str, timeframe: str = "daily") -> Optional[Forecast]:
        """Gets a forecast for a pair slug and timeframe (checks cache first)."""
        cache_key = f"forecast:{slug.lower()}:{timeframe.lower()}"
        cached = await redis_client.get_cached(cache_key)
        if cached:
            pair_data = cached.pop("pair", None)
            fc = Forecast(**cached)
            if pair_data:
                from app.models.pair import Pair
                fc.pair = Pair(**pair_data)
            return fc
            
        forecast = await self.repo.get_by_pair_slug(slug, timeframe)
        if forecast:
            d = {c.name: getattr(forecast, c.name) for c in forecast.__table__.columns}
            d["support_levels"] = [float(lvl) for lvl in forecast.support_levels]
            d["resistance_levels"] = [float(lvl) for lvl in forecast.resistance_levels]
            if forecast.pair:
                d["pair"] = {c.name: getattr(forecast.pair, c.name) for c in forecast.pair.__table__.columns}
            await redis_client.set_cached(cache_key, d, ttl=settings.REDIS_CACHE_TTL_FORECASTS)
            
        return forecast

    async def create_forecast(self, schema: Any, creator_id: Optional[uuid.UUID] = None) -> Forecast:
        """Saves a new forecast and invalidates corresponding caches."""
        forecast_data = schema.model_dump()
        forecast_data["created_by"] = creator_id
        
        forecast = await self.repo.create(forecast_data)
        
        pair = await self.pair_repo.get(forecast.pair_id)
        await self._invalidate_caches(pair.slug if pair else None, forecast.timeframe)
        
        return forecast

    async def update_forecast(self, forecast_id: uuid.UUID, schema: Any) -> Optional[Forecast]:
        """Updates an existing forecast and invalidates caches."""
        update_data = schema.model_dump(exclude_unset=True)
        updated_forecast = await self.repo.update(forecast_id, update_data)
        
        if updated_forecast:
            pair = await self.pair_repo.get(updated_forecast.pair_id)
            await self._invalidate_caches(pair.slug if pair else None, updated_forecast.timeframe)
            
        return updated_forecast

    async def delete_forecast(self, forecast_id: uuid.UUID) -> bool:
        """Deletes a forecast and invalidates caches."""
        forecast = await self.repo.get(forecast_id)
        if not forecast:
            return False
            
        pair = await self.pair_repo.get(forecast.pair_id)
        timeframe = forecast.timeframe
        
        await self.repo.delete(forecast_id)
        await self._invalidate_caches(pair.slug if pair else None, timeframe)
        return True

    async def _invalidate_caches(self, pair_slug: Optional[str], timeframe: str) -> None:
        """Utility method to clean lists and specific pair caches in Redis."""
        await redis_client.delete_pattern("forecasts:list:*")
        if pair_slug:
            await redis_client.delete_cached(f"forecast:{pair_slug.lower()}:{timeframe.lower()}")
