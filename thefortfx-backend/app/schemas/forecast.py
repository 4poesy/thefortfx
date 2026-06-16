from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict, Field, model_validator

class ForecastResponse(BaseModel):
    """API contract returning structural forecast details, including support and resistance levels."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    pair_id: uuid.UUID
    
    # Flat pair properties mapped from the associated Pair model
    symbol: Optional[str] = None
    slug: Optional[str] = None
    display_name: Optional[str] = None
    
    bullish_score: int
    bearish_score: int
    trend: str
    support_levels: List[float] = Field(default_factory=list)
    resistance_levels: List[float] = Field(default_factory=list)
    
    technical_summary: str
    fundamental_summary: str
    forecast_summary: str
    
    ema_signal: Optional[str] = None
    rsi_value: Optional[int] = None
    macd_signal: Optional[str] = None
    timeframe: str
    valid_until: datetime
    created_at: datetime

    @model_validator(mode="before")
    @classmethod
    def resolve_pair_fields(cls, data: Any) -> Any:
        """Helper to resolve flat asset details from the nested pair relationship."""
        pair = getattr(data, "pair", None)
        if pair:
            setattr(data, "symbol", getattr(pair, "symbol", None))
            setattr(data, "slug", getattr(pair, "slug", None))
            setattr(data, "display_name", getattr(pair, "display_name", None))
        elif isinstance(data, dict):
            pair_dict = data.get("pair")
            if pair_dict:
                if isinstance(pair_dict, dict):
                    data["symbol"] = pair_dict.get("symbol")
                    data["slug"] = pair_dict.get("slug")
                    data["display_name"] = pair_dict.get("display_name")
                else:
                    data["symbol"] = getattr(pair_dict, "symbol", None)
                    data["slug"] = getattr(pair_dict, "slug", None)
                    data["display_name"] = getattr(pair_dict, "display_name", None)
        return data

class ForecastCreate(BaseModel):
    """API contract for creating a new forecast."""
    pair_id: uuid.UUID
    bullish_score: int
    bearish_score: int
    trend: str
    support_levels: List[float]
    resistance_levels: List[float]
    technical_summary: str
    fundamental_summary: str
    forecast_summary: str
    ema_signal: Optional[str] = None
    rsi_value: Optional[int] = None
    macd_signal: Optional[str] = None
    timeframe: str
    valid_until: datetime

class ForecastUpdate(BaseModel):
    """API contract for updating an existing forecast."""
    bullish_score: Optional[int] = None
    bearish_score: Optional[int] = None
    trend: Optional[str] = None
    support_levels: Optional[List[float]] = None
    resistance_levels: Optional[List[float]] = None
    technical_summary: Optional[str] = None
    fundamental_summary: Optional[str] = None
    forecast_summary: Optional[str] = None
    ema_signal: Optional[str] = None
    rsi_value: Optional[int] = None
    macd_signal: Optional[str] = None
    timeframe: Optional[str] = None
    valid_until: Optional[datetime] = None
