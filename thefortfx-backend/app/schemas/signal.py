from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict, Field, model_validator

class SignalResponse(BaseModel):
    """API contract for returning a signal, including resolved asset details."""
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: uuid.UUID
    pair_id: uuid.UUID
    
    # Flat pair properties mapped from the associated Pair model
    symbol: Optional[str] = None
    slug: Optional[str] = None
    display_name: Optional[str] = None
    category: Optional[str] = None
    
    direction: str
    confidence: int
    entry: float
    stop: float
    target: float
    risk_pips: int
    reward_pips: int
    r_multiple: float
    risk_level: str
    setup: str
    status: str
    
    bullish_pct: Optional[int] = None
    bearish_pct: Optional[int] = None
    opportunity_score: Optional[int] = None
    supporting_factors: List[str] = Field(default_factory=list)
    
    expires_at: datetime
    created_at: datetime
    last_updated: datetime = Field(validation_alias="updated_at")

    @model_validator(mode="before")
    @classmethod
    def resolve_pair_fields(cls, data: Any) -> Any:
        """Dynamically extracts asset info from the nested pair relation if available."""
        # Check if we are dealing with a SQLAlchemy model or object
        pair = getattr(data, "pair", None)
        if pair:
            setattr(data, "symbol", getattr(pair, "symbol", None))
            setattr(data, "slug", getattr(pair, "slug", None))
            setattr(data, "display_name", getattr(pair, "display_name", None))
            setattr(data, "category", getattr(pair, "category", None))
        elif isinstance(data, dict):
            # If we are dealing with a dictionary
            pair_dict = data.get("pair")
            if pair_dict:
                if isinstance(pair_dict, dict):
                    data["symbol"] = pair_dict.get("symbol")
                    data["slug"] = pair_dict.get("slug")
                    data["display_name"] = pair_dict.get("display_name")
                    data["category"] = pair_dict.get("category")
                else:
                    data["symbol"] = getattr(pair_dict, "symbol", None)
                    data["slug"] = getattr(pair_dict, "slug", None)
                    data["display_name"] = getattr(pair_dict, "display_name", None)
                    data["category"] = getattr(pair_dict, "category", None)
        return data

class SignalCreate(BaseModel):
    """API contract for creating a new signal."""
    pair_id: uuid.UUID
    direction: str
    confidence: int
    entry: float
    stop: float
    target: float
    risk_pips: int
    reward_pips: int
    r_multiple: float
    risk_level: str
    setup: str
    bullish_pct: Optional[int] = None
    bearish_pct: Optional[int] = None
    opportunity_score: Optional[int] = None
    supporting_factors: List[str] = Field(default_factory=list)
    expires_at: datetime

class SignalUpdate(BaseModel):
    """API contract for updating an existing signal."""
    direction: Optional[str] = None
    confidence: Optional[int] = None
    entry: Optional[float] = None
    stop: Optional[float] = None
    target: Optional[float] = None
    status: Optional[str] = None
    expires_at: Optional[datetime] = None

class SignalHistoryResponse(BaseModel):
    """API contract returning structural changes for a signal over time."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    signal_id: uuid.UUID
    direction: str
    confidence: int
    entry: float
    stop: float
    target: float
    status: str
    changed_at: datetime
