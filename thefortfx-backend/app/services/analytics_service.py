from __future__ import annotations
from datetime import datetime, timedelta
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import Profile
from app.models.signal import Signal
from app.models.journal import JournalEntry
from app.models.subscription import Subscription

class AnalyticsService:
    """Service layer providing administrative metrics on platform usage, signal accuracy, and revenue."""
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_platform_analytics(self) -> dict:
        """Aggregates active user volumes, total signals, journal metrics, and signal accuracy rates."""
        now = datetime.utcnow()
        thirty_days_ago = now - timedelta(days=30)
        
        # Total users count
        total_users_q = select(func.count(Profile.id))
        total_users = (await self.db.execute(total_users_q)).scalar_one() or 0
        
        # Active users (last 30 days) count
        active_users_q = select(func.count(Profile.id)).where(Profile.last_seen_at >= thirty_days_ago)
        active_users_30d = (await self.db.execute(active_users_q)).scalar_one() or 0
        
        # Total signals posted
        total_signals_q = select(func.count(Signal.id))
        total_signals = (await self.db.execute(total_signals_q)).scalar_one() or 0
        
        # Total trades logged
        total_trades_q = select(func.count(JournalEntry.id))
        total_trades = (await self.db.execute(total_trades_q)).scalar_one() or 0
        
        # Signal accuracy (hit_tp vs hit_sl)
        hit_tp_q = select(func.count(Signal.id)).where(Signal.status == "hit_tp")
        hit_tp = (await self.db.execute(hit_tp_q)).scalar_one() or 0
        
        hit_sl_q = select(func.count(Signal.id)).where(Signal.status == "hit_sl")
        hit_sl = (await self.db.execute(hit_sl_q)).scalar_one() or 0
        
        total_resolved = hit_tp + hit_sl
        accuracy = (hit_tp / total_resolved * 100.0) if total_resolved > 0 else 0.0
        
        return {
            "total_users": total_users,
            "active_users_30d": active_users_30d,
            "total_signals": total_signals,
            "total_trades_logged": total_trades,
            "signals_accuracy": round(accuracy, 2)
        }

    async def get_revenue_metrics(self) -> dict:
        """Calculates subscription breakdowns and estimates MRR (Monthly Recurring Revenue)."""
        # Active subscribers count
        subscribers_q = select(func.count(Subscription.id)).where(Subscription.status == "active")
        total_subscribers = (await self.db.execute(subscribers_q)).scalar_one() or 0
        
        # Premium/Pro subscribers count
        premium_q = select(func.count(Subscription.id)).where(
            Subscription.status == "active",
            Subscription.plan == "premium"
        )
        pro_count = (await self.db.execute(premium_q)).scalar_one() or 0
        
        # Agency subscribers count
        agency_q = select(func.count(Subscription.id)).where(
            Subscription.status == "active",
            Subscription.plan == "agency"
        )
        agency_count = (await self.db.execute(agency_q)).scalar_one() or 0
        
        # MRR Estimate (Premium = $29/mo, Agency = $79/mo)
        mrr_estimate = pro_count * 29.0 + agency_count * 79.0
        
        return {
            "total_subscribers": total_subscribers,
            "pro_count": pro_count,
            "agency_count": agency_count,
            "mrr_estimate": round(mrr_estimate, 2)
        }
