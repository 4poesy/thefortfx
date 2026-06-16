from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.pair import PairResponse
from app.schemas.signal import SignalResponse

class WatchlistResponse(BaseModel):
    """API contract returning items on a user's watchlist, with nested details and active signals."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    pair_id: uuid.UUID
    pair: PairResponse
    latest_signal: Optional[SignalResponse] = None
    created_at: datetime

class WatchlistCreate(BaseModel):
    """API contract for adding an asset to the user's watchlist using its slug."""
    pair_slug: str
