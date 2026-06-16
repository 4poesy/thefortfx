from __future__ import annotations
import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

class NewsResponse(BaseModel):
    """API contract returning structural news article details."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    slug: str
    title: str
    summary: str
    content: Optional[str] = None
    source: str
    source_url: Optional[str] = None
    image_url: Optional[str] = None
    impact: Optional[str] = None
    affected_pairs: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    published_at: datetime
