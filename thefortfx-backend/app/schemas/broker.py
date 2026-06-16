from __future__ import annotations
import uuid
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

class BrokerResponse(BaseModel):
    """API contract returning structural details of a broker."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    slug: str
    name: str
    logo_url: str
    description: str
    overall_score: int
    trust_score: int
    fees_score: int
    platform_score: int
    rating: float
    review_count: int
    regulation: List[str] = Field(default_factory=list)
    min_deposit: int
    max_leverage: str
    platforms: List[str] = Field(default_factory=list)
    spread_eurusd: float
    spread_gbpusd: float
    spread_xauusd: float
    founded: int
    headquarters: str
    pros: List[str] = Field(default_factory=list)
    cons: List[str] = Field(default_factory=list)
    affiliate_url: str
    is_top_rated: bool
    display_order: int

class BrokerCompareResponse(BaseModel):
    """API contract returning two brokers side-by-side for comparison."""
    broker_a: BrokerResponse
    broker_b: BrokerResponse
