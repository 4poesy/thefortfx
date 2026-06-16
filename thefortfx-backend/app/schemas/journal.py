from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class JournalEntryResponse(BaseModel):
    """API contract returning complete trade journal entry details."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    pair_symbol: str
    direction: str
    entry_price: float
    exit_price: Optional[float] = None
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None
    lot_size: float
    pips_gained: Optional[float] = None
    profit_loss: Optional[float] = None
    r_multiple: Optional[float] = None
    outcome: Optional[str] = None
    setup: Optional[str] = None
    notes: Optional[str] = None
    screenshot_url: Optional[str] = None
    trade_date: datetime
    closed_at: Optional[datetime] = None
    created_at: datetime

class JournalEntryCreate(BaseModel):
    """API contract for creating a trade journal entry."""
    pair_symbol: str
    direction: str
    entry_price: float
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None
    lot_size: float
    setup: Optional[str] = None
    notes: Optional[str] = None
    trade_date: datetime

class JournalEntryUpdate(BaseModel):
    """API contract for updating/closing a trade journal entry."""
    exit_price: Optional[float] = None
    pips_gained: Optional[float] = None
    profit_loss: Optional[float] = None
    r_multiple: Optional[float] = None
    outcome: Optional[str] = None
    notes: Optional[str] = None
    closed_at: Optional[datetime] = None
    screenshot_url: Optional[str] = None

class JournalStatsResponse(BaseModel):
    """API contract returning global journal statistics."""
    total_trades: int
    wins: int
    losses: int
    breakevens: int
    win_rate: float
    avg_r_multiple: float
    total_pnl: float
    best_trade: float
    worst_trade: float

class MonthlyStatsResponse(BaseModel):
    """API contract returning journal statistics grouped by month."""
    month: str
    total_trades: int
    wins: int
    losses: int
    win_rate: float
    total_pnl: float

class PairStatsResponse(BaseModel):
    """API contract returning journal statistics grouped by currency pair."""
    pair_symbol: str
    total_trades: int
    wins: int
    losses: int
    win_rate: float
    total_pnl: float
