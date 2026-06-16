from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict, Field, model_validator

class AlertResponse(BaseModel):
    """API contract returning active user alert configurations."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    pair_id: uuid.UUID
    pair_symbol: Optional[str] = None
    
    alert_type: str
    direction: Optional[str] = None
    min_confidence: int
    
    price_level: Optional[float] = None
    price_condition: Optional[str] = None
    
    channels: List[str] = Field(default_factory=list)
    is_active: bool
    last_triggered: Optional[datetime] = None
    created_at: datetime

    @model_validator(mode="before")
    @classmethod
    def resolve_pair_symbol(cls, data: Any) -> Any:
        """Resolves pair_symbol from the nested pair relationship."""
        pair = getattr(data, "pair", None)
        if pair:
            setattr(data, "pair_symbol", getattr(pair, "symbol", None))
        elif isinstance(data, dict):
            pair_dict = data.get("pair")
            if pair_dict:
                if isinstance(pair_dict, dict):
                    data["pair_symbol"] = pair_dict.get("symbol")
                else:
                    data["pair_symbol"] = getattr(pair_dict, "symbol", None)
        return data

class AlertCreate(BaseModel):
    """API contract for setting up a new alert configuration."""
    pair_id: uuid.UUID
    alert_type: str
    direction: Optional[str] = None
    min_confidence: int = 0
    price_level: Optional[float] = None
    price_condition: Optional[str] = None
    channels: List[str] = Field(default_factory=list)

class AlertUpdate(BaseModel):
    """API contract for updating select fields on an alert."""
    alert_type: Optional[str] = None
    direction: Optional[str] = None
    min_confidence: Optional[int] = None
    price_level: Optional[float] = None
    price_condition: Optional[str] = None
    channels: Optional[List[str]] = None
    is_active: Optional[bool] = None

class AlertDeliveryResponse(BaseModel):
    """API contract returning alert delivery history metrics."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    channel: str
    payload: dict
    status: str
    delivered_at: datetime
