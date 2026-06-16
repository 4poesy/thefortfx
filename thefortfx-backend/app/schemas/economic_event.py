from __future__ import annotations
import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

class EconomicEventResponse(BaseModel):
    """API contract returning structural economic calendar event details."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    slug: str
    title: str
    currency: str
    country: str
    impact: str
    event_datetime: datetime
    
    forecast: Optional[str] = None
    previous: Optional[str] = None
    actual: Optional[str] = None
    description: Optional[str] = None
    affected_pairs: List[str] = Field(default_factory=list)
    
    source: str
    is_released: bool
