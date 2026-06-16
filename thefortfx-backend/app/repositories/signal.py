from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.repositories.base import BaseRepository
from app.models.signal import Signal, SignalHistory
from app.models.pair import Pair

class SignalRepository(BaseRepository[Signal]):
    """Repository class handling data queries for Signals and SignalHistory."""
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Signal, db)

    async def get_active_signals(
        self,
        *,
        direction: Optional[str] = None,
        risk_level: Optional[str] = None,
        min_confidence: Optional[int] = None,
        category: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> Tuple[List[Signal], int]:
        """Fetches active signals, with dynamic filters, loaded with their associated asset Pair."""
        query = select(Signal).join(Pair).where(Signal.status == "active")
        
        if direction:
            query = query.where(Signal.direction == direction)
        if risk_level:
            query = query.where(Signal.risk_level == risk_level)
        if min_confidence is not None:
            query = query.where(Signal.confidence >= min_confidence)
        if category:
            query = query.where(Pair.category == category)
            
        # Count total records matching filters
        count_query = select(func.count()).select_from(query.subquery())
        count_result = await self.db.execute(count_query)
        total_count = count_result.scalar_one()
        
        # Load related pair data
        query = query.options(selectinload(Signal.pair))
        query = query.order_by(Signal.created_at.desc()).offset(skip).limit(limit)
        
        result = await self.db.execute(query)
        items = list(result.scalars().all())
        
        return items, total_count

    async def get_signal_by_pair_slug(self, slug: str) -> Optional[Signal]:
        """Gets the latest active signal for a pair by its slug."""
        query = (
            select(Signal)
            .join(Pair)
            .where(Pair.slug == slug.lower())
            .where(Signal.status == "active")
            .options(selectinload(Signal.pair))
            .order_by(Signal.created_at.desc())
            .limit(1)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_signal_history(self, signal_id: uuid.UUID) -> List[SignalHistory]:
        """Gets the change logs/history for a specific signal."""
        query = (
            select(SignalHistory)
            .where(SignalHistory.signal_id == signal_id)
            .order_by(SignalHistory.changed_at.desc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create_history_entry(self, signal: Signal, changed_by: Optional[uuid.UUID] = None) -> SignalHistory:
        """Saves a snapshot of the current signal state to history (called before updating)."""
        history_entry = SignalHistory(
            signal_id=signal.id,
            pair_id=signal.pair_id,
            direction=signal.direction,
            confidence=signal.confidence,
            entry=signal.entry,
            stop=signal.stop,
            target=signal.target,
            status=signal.status,
            changed_by=changed_by
        )
        self.db.add(history_entry)
        await self.db.flush()
        return history_entry

    async def expire_stale_signals(self) -> int:
        """Sweeps the DB, expiring any active signals that have passed their expires_at date."""
        now = datetime.utcnow()
        query = select(Signal).where(Signal.status == "active").where(Signal.expires_at < now)
        result = await self.db.execute(query)
        stale_signals = result.scalars().all()
        
        count = 0
        for signal in stale_signals:
            # Archive state to history
            await self.create_history_entry(signal)
            # Expire signal
            signal.status = "expired"
            self.db.add(signal)
            count += 1
            
        await self.db.flush()
        return count
