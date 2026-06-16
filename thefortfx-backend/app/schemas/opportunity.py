from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict, model_validator

class OpportunityResponse(BaseModel):
    """API contract returning complete computed asset opportunities, ranking, and technical criteria."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    pair_id: uuid.UUID
    
    # Flat pair properties mapped from the associated Pair model
    symbol: Optional[str] = None
    slug: Optional[str] = None
    display_name: Optional[str] = None
    category: Optional[str] = None
    
    rank: Optional[int] = None
    opportunity_score: int
    trend_score: int
    sentiment_score: int
    consensus_score: int
    volatility_score: int
    news_risk_score: int
    
    trend: str
    news_risk: str
    sentiment: str
    direction: str
    
    # Optional fields resolved from active signals
    confidence: Optional[int] = None
    entry: Optional[float] = None
    stop: Optional[float] = None
    target: Optional[float] = None
    r_multiple: Optional[float] = None
    setup: Optional[str] = None
    
    is_top: bool
    calculated_at: datetime
    valid_until: datetime

    @model_validator(mode="before")
    @classmethod
    def resolve_associated_fields(cls, data: Any) -> Any:
        """Resolves nested asset Pair and Signal properties into flat attributes."""
        # Resolve pair details
        pair = getattr(data, "pair", None)
        if pair:
            setattr(data, "symbol", getattr(pair, "symbol", None))
            setattr(data, "slug", getattr(pair, "slug", None))
            setattr(data, "display_name", getattr(pair, "display_name", None))
            setattr(data, "category", getattr(pair, "category", None))
        elif isinstance(data, dict):
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
                    
        # Resolve signal details
        signal = getattr(data, "signal", None)
        if signal:
            setattr(data, "confidence", getattr(signal, "confidence", None))
            setattr(data, "entry", float(getattr(signal, "entry", 0.0)) if getattr(signal, "entry", None) is not None else None)
            setattr(data, "stop", float(getattr(signal, "stop", 0.0)) if getattr(signal, "stop", None) is not None else None)
            setattr(data, "target", float(getattr(signal, "target", 0.0)) if getattr(signal, "target", None) is not None else None)
            setattr(data, "r_multiple", float(getattr(signal, "r_multiple", 0.0)) if getattr(signal, "r_multiple", None) is not None else None)
            setattr(data, "setup", getattr(signal, "setup", None))
        elif isinstance(data, dict):
            sig_dict = data.get("signal")
            if sig_dict:
                if isinstance(sig_dict, dict):
                    data["confidence"] = sig_dict.get("confidence")
                    data["entry"] = sig_dict.get("entry")
                    data["stop"] = sig_dict.get("stop")
                    data["target"] = sig_dict.get("target")
                    data["r_multiple"] = sig_dict.get("r_multiple")
                    data["setup"] = sig_dict.get("setup")
                else:
                    data["confidence"] = getattr(sig_dict, "confidence", None)
                    data["entry"] = float(getattr(sig_dict, "entry", 0.0)) if getattr(sig_dict, "entry", None) is not None else None
                    data["stop"] = float(getattr(sig_dict, "stop", 0.0)) if getattr(sig_dict, "stop", None) is not None else None
                    data["target"] = float(getattr(sig_dict, "target", 0.0)) if getattr(sig_dict, "target", None) is not None else None
                    data["r_multiple"] = float(getattr(sig_dict, "r_multiple", 0.0)) if getattr(sig_dict, "r_multiple", None) is not None else None
                    data["setup"] = getattr(sig_dict, "setup", None)
                    
        return data
