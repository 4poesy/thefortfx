from __future__ import annotations
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Boolean, DateTime, CheckConstraint, text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin

class EconomicEvent(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "economic_events"

    slug: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    currency: Mapped[str] = mapped_column(String, index=True, nullable=False)
    country: Mapped[str] = mapped_column(String, nullable=False)
    impact: Mapped[str] = mapped_column(String, index=True, nullable=False)
    event_datetime: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)
    
    forecast: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    previous: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    actual: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    affected_pairs: Mapped[List[str]] = mapped_column(
        ARRAY(String),
        default=list,
        server_default=text("ARRAY[]::varchar[]")
    )
    
    source: Mapped[str] = mapped_column(String, default="forex_factory", server_default="forex_factory", nullable=False)
    is_released: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false", index=True, nullable=False)

    __table_args__ = (
        CheckConstraint(impact.in_(["High", "Medium", "Low"]), name="chk_event_impact"),
    )
