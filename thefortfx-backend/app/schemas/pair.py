from __future__ import annotations
import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict

class PairResponse(BaseModel):
    """API contract returning basic properties of an asset Pair."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    symbol: str
    slug: str
    display_name: str
    base_currency: str
    quote_currency: str
    category: str
    description: Optional[str] = None
    pip_decimal: int
    is_active: bool
    display_order: int

class PairDetailResponse(PairResponse):
    """API contract returning Pair details along with the latest active signal/forecast."""
    latest_signal: Optional[SignalResponse] = None
    latest_forecast: Optional[ForecastResponse] = None

# Avoid circular imports by importing at the bottom
from app.schemas.signal import SignalResponse
from app.schemas.forecast import ForecastResponse
