from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class ProfileResponse(BaseModel):
    """API contract for returning complete user profile details."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    display_name: str
    avatar_url: Optional[str] = None
    role: str
    country: Optional[str] = None
    timezone: str
    experience_level: str
    risk_appetite: str
    preferred_pairs: List[str]
    is_active: bool
    last_seen_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

class ProfileUpdate(BaseModel):
    """API contract for updating select profile fields."""
    display_name: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = None
    experience_level: Optional[str] = None
    risk_appetite: Optional[str] = None
    preferred_pairs: Optional[List[str]] = None
    telegram_chat_id: Optional[str] = None

class UserStatsResponse(BaseModel):
    """API contract returning overall trading and platform stats for a user."""
    total_trades: int
    wins: int
    losses: int
    win_rate: float
    total_pnl: float
    avg_r_multiple: float
    best_trade: Optional[float] = None
    worst_trade: Optional[float] = None
    active_alerts: int
    watchlist_count: int
