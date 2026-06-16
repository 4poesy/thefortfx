from __future__ import annotations
import uuid
import hashlib
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
import orjson

from app.config import get_settings
from app.core.redis import redis_client
from app.repositories.signal import SignalRepository
from app.repositories.pair import PairRepository
from app.models.signal import Signal, SignalHistory
from app.schemas.signal import SignalCreate, SignalUpdate

settings = get_settings()

class SignalService:
    """Service layer coordinating Signal data transactions and cache validations."""
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = SignalRepository(db)
        self.pair_repo = PairRepository(db)

    def _hash_filters(self, filters: dict, skip: int, limit: int) -> str:
        """Helper to create a deterministic hash for query conditions to cache list results."""
        data = {"filters": filters, "skip": skip, "limit": limit}
        serialized = orjson.dumps(data, option=orjson.OPT_SORT_KEYS)
        return hashlib.md5(serialized).hexdigest()

    async def get_active_signals(
        self,
        *,
        direction: Optional[str] = None,
        risk_level: Optional[str] = None,
        min_confidence: Optional[int] = None,
        category: Optional[str] = None,
        page: int = 1,
        limit: int = 20
    ) -> Tuple[List[Signal], int]:
        """Gets active signals with optional caching filters, falling back to DB on cache misses."""
        skip = (page - 1) * limit
        filters = {
            "direction": direction,
            "risk_level": risk_level,
            "min_confidence": min_confidence,
            "category": category
        }
        
        cache_hash = self._hash_filters(filters, skip, limit)
        cache_key = f"signals:list:{cache_hash}"
        
        cached = await redis_client.get_cached(cache_key)
        if cached:
            # Reconstruct ORM entities
            from app.models.pair import Pair
            items = []
            for item in cached["items"]:
                pair_data = item.pop("pair", None)
                sig = Signal(**item)
                if pair_data:
                    sig.pair = Pair(**pair_data)
                items.append(sig)
            return items, cached["total"]
            
        items, total = await self.repo.get_active_signals(
            direction=direction,
            risk_level=risk_level,
            min_confidence=min_confidence,
            category=category,
            skip=skip,
            limit=limit
        )
        
        # Cache results
        serialized_items = []
        for item in items:
            d = {c.name: getattr(item, c.name) for c in item.__table__.columns}
            # Serialize relation
            if item.pair:
                d["pair"] = {c.name: getattr(item.pair, c.name) for c in item.pair.__table__.columns}
            serialized_items.append(d)
            
        await redis_client.set_cached(
            cache_key,
            {"items": serialized_items, "total": total},
            ttl=settings.REDIS_CACHE_TTL_SIGNALS
        )
        
        return items, total

    async def get_signal_by_slug(self, slug: str) -> Optional[Signal]:
        """Fetches the latest active signal for a pair slug (checks cache first)."""
        cache_key = f"signal:{slug.lower()}"
        cached = await redis_client.get_cached(cache_key)
        if cached:
            pair_data = cached.pop("pair", None)
            sig = Signal(**cached)
            if pair_data:
                from app.models.pair import Pair
                sig.pair = Pair(**pair_data)
            return sig
            
        signal = await self.repo.get_signal_by_pair_slug(slug)
        if signal:
            d = {c.name: getattr(signal, c.name) for c in signal.__table__.columns}
            if signal.pair:
                d["pair"] = {c.name: getattr(signal.pair, c.name) for c in signal.pair.__table__.columns}
            await redis_client.set_cached(cache_key, d, ttl=settings.REDIS_CACHE_TTL_SIGNALS)
            
        return signal

    async def create_signal(self, schema: SignalCreate, creator_id: Optional[uuid.UUID] = None) -> Signal:
        """Creates a new signal and invalidates cache keys."""
        signal_data = schema.model_dump()
        signal_data["created_by"] = creator_id
        
        signal = await self.repo.create(signal_data)
        
        # Get slug to invalidate specific cache
        pair = await self.pair_repo.get(signal.pair_id)
        await self._invalidate_caches(pair.slug if pair else None)
        
        return signal

    async def update_signal(
        self,
        signal_id: uuid.UUID,
        schema: SignalUpdate,
        changer_id: Optional[uuid.UUID] = None
    ) -> Optional[Signal]:
        """Modifies an existing signal, creating a historical record, and invalidating caches."""
        signal = await self.repo.get(signal_id)
        if not signal:
            return None
            
        # Log snapshot to history
        await self.repo.create_history_entry(signal, changer_id)
        
        update_data = schema.model_dump(exclude_unset=True)
        updated_signal = await self.repo.update(signal_id, update_data)
        
        # Get slug
        pair = await self.pair_repo.get(updated_signal.pair_id) if updated_signal else None
        await self._invalidate_caches(pair.slug if pair else None)
        
        return updated_signal

    async def delete_signal(self, signal_id: uuid.UUID, changer_id: Optional[uuid.UUID] = None) -> bool:
        """Sets a signal to 'cancelled' (soft delete) and invalidates caches."""
        signal = await self.repo.get(signal_id)
        if not signal:
            return False
            
        # Log to history
        await self.repo.create_history_entry(signal, changer_id)
        
        # Cancel signal
        await self.repo.update(signal_id, {"status": "cancelled"})
        
        # Get slug
        pair = await self.pair_repo.get(signal.pair_id)
        await self._invalidate_caches(pair.slug if pair else None)
        
        return True

    async def get_signal_history(self, signal_id: uuid.UUID) -> List[SignalHistory]:
        """Gets all previous versions/history entries of a signal."""
        return await self.repo.get_signal_history(signal_id)

    async def _invalidate_caches(self, pair_slug: Optional[str]) -> None:
        """Utility method to clean lists and specific pair caches in Redis."""
        # Clear list summaries
        await redis_client.delete_pattern("signals:list:*")
        # Clear pair detail
        if pair_slug:
            await redis_client.delete_cached(f"signal:{pair_slug.lower()}")
