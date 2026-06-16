from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict, model_validator

class SentimentResponse(BaseModel):
    """API contract returning structural sentiment breakdown (retail ratio + institutional bias)."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    pair_id: uuid.UUID
    
    # Flat pair properties mapped from the associated Pair model
    symbol: Optional[str] = None
    slug: Optional[str] = None
    display_name: Optional[str] = None
    
    retail_bullish_pct: int
    retail_bearish_pct: int
    institutional_bias: Optional[str] = None
    overall_sentiment: str
    source: str
    recorded_at: datetime

    @model_validator(mode="before")
    @classmethod
    def resolve_pair_fields(cls, data: Any) -> Any:
        """Helper to resolve flat asset details from the nested pair relation."""
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

class SentimentCreate(BaseModel):
    """API contract for submitting new sentiment logs."""
    pair_id: uuid.UUID
    retail_bullish_pct: int
    retail_bearish_pct: int
    institutional_bias: Optional[str] = None
    overall_sentiment: str
    source: str = "manual"
