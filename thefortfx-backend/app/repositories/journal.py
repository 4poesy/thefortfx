from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, List, Tuple, Dict, Any
from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.journal import JournalEntry

class JournalRepository(BaseRepository[JournalEntry]):
    """Repository class handling data queries and aggregations for JournalEntry."""
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(JournalEntry, db)

    async def get_user_entries(
        self,
        user_id: uuid.UUID,
        outcome: Optional[str] = None,
        pair_symbol: Optional[str] = None,
        date_from: Optional[datetime] = None,
        skip: int = 0,
        limit: int = 20
    ) -> Tuple[List[JournalEntry], int]:
        """Fetches a user's journal entries with optional filters for outcome, pair, and date."""
        query = select(JournalEntry).where(JournalEntry.user_id == user_id)
        
        if outcome:
            query = query.where(JournalEntry.outcome == outcome)
        if pair_symbol:
            query = query.where(JournalEntry.pair_symbol == pair_symbol.upper())
        if date_from:
            query = query.where(JournalEntry.trade_date >= date_from)
            
        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        count_result = await self.db.execute(count_query)
        total_count = count_result.scalar_one()
        
        # Apply order, limit, offset
        query = query.order_by(JournalEntry.trade_date.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        items = list(result.scalars().all())
        
        return items, total_count

    async def get_user_stats(self, user_id: uuid.UUID) -> Dict[str, Any]:
        """Aggregates win/loss rates, average R multiples, and net P&L for a user."""
        query = select(
            func.count(JournalEntry.id).label("total_trades"),
            func.count(JournalEntry.id).filter(JournalEntry.outcome == "win").label("wins"),
            func.count(JournalEntry.id).filter(JournalEntry.outcome == "loss").label("losses"),
            func.count(JournalEntry.id).filter(JournalEntry.outcome == "breakeven").label("breakevens"),
            func.sum(JournalEntry.profit_loss).label("total_pnl"),
            func.avg(JournalEntry.r_multiple).filter(JournalEntry.outcome != "open").label("avg_r_multiple"),
            func.max(JournalEntry.profit_loss).label("best_trade"),
            func.min(JournalEntry.profit_loss).label("worst_trade")
        ).where(JournalEntry.user_id == user_id)
        
        result = await self.db.execute(query)
        row = result.first()
        
        if not row or row.total_trades == 0:
            return {
                "total_trades": 0, "wins": 0, "losses": 0, "breakevens": 0,
                "win_rate": 0.0, "avg_r_multiple": 0.0, "total_pnl": 0.0,
                "best_trade": 0.0, "worst_trade": 0.0
            }
            
        wins = row.wins or 0
        losses = row.losses or 0
        total_closed = wins + losses
        win_rate = (wins / total_closed * 100.0) if total_closed > 0 else 0.0
        
        return {
            "total_trades": row.total_trades or 0,
            "wins": wins,
            "losses": losses,
            "breakevens": row.breakevens or 0,
            "win_rate": round(win_rate, 2),
            "avg_r_multiple": round(float(row.avg_r_multiple), 2) if row.avg_r_multiple is not None else 0.0,
            "total_pnl": round(float(row.total_pnl), 2) if row.total_pnl is not None else 0.0,
            "best_trade": round(float(row.best_trade), 2) if row.best_trade is not None else 0.0,
            "worst_trade": round(float(row.worst_trade), 2) if row.worst_trade is not None else 0.0
        }

    async def get_monthly_stats(self, user_id: uuid.UUID) -> List[Dict[str, Any]]:
        """Calculates monthly journal summaries (trade volume, win rate, total P&L)."""
        # PostgreSQL specific to_char grouping
        query = select(
            func.to_char(JournalEntry.trade_date, 'YYYY-MM').label("month"),
            func.count(JournalEntry.id).label("total_trades"),
            func.count(JournalEntry.id).filter(JournalEntry.outcome == "win").label("wins"),
            func.count(JournalEntry.id).filter(JournalEntry.outcome == "loss").label("losses"),
            func.sum(JournalEntry.profit_loss).label("total_pnl")
        ).where(JournalEntry.user_id == user_id).group_by(text("month")).order_by(text("month DESC"))
        
        result = await self.db.execute(query)
        rows = result.all()
        
        stats = []
        for r in rows:
            wins = r.wins or 0
            losses = r.losses or 0
            total_closed = wins + losses
            win_rate = (wins / total_closed * 100.0) if total_closed > 0 else 0.0
            
            stats.append({
                "month": r.month,
                "total_trades": r.total_trades or 0,
                "wins": wins,
                "losses": losses,
                "win_rate": round(win_rate, 2),
                "total_pnl": round(float(r.total_pnl), 2) if r.total_pnl is not None else 0.0
            })
            
        return stats

    async def get_pair_stats(self, user_id: uuid.UUID) -> List[Dict[str, Any]]:
        """Calculates performance summaries grouped by currency pair."""
        query = select(
            JournalEntry.pair_symbol,
            func.count(JournalEntry.id).label("total_trades"),
            func.count(JournalEntry.id).filter(JournalEntry.outcome == "win").label("wins"),
            func.count(JournalEntry.id).filter(JournalEntry.outcome == "loss").label("losses"),
            func.sum(JournalEntry.profit_loss).label("total_pnl")
        ).where(JournalEntry.user_id == user_id).group_by(JournalEntry.pair_symbol).order_by(text("total_pnl DESC"))
        
        result = await self.db.execute(query)
        rows = result.all()
        
        stats = []
        for r in rows:
            wins = r.wins or 0
            losses = r.losses or 0
            total_closed = wins + losses
            win_rate = (wins / total_closed * 100.0) if total_closed > 0 else 0.0
            
            stats.append({
                "pair_symbol": r.pair_symbol,
                "total_trades": r.total_trades or 0,
                "wins": wins,
                "losses": losses,
                "win_rate": round(win_rate, 2),
                "total_pnl": round(float(r.total_pnl), 2) if r.total_pnl is not None else 0.0
            })
            
        return stats
