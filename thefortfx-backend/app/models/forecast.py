from __future__ import annotations
import uuid
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import String, Integer, Numeric, DateTime, ForeignKey, CheckConstraint, text
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin

class Forecast(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "forecasts"

    pair_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("pairs.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    bullish_score: Mapped[int] = mapped_column(Integer, nullable=False)
    bearish_score: Mapped[int] = mapped_column(Integer, nullable=False)
    trend: Mapped[str] = mapped_column(String, nullable=False, index=True)
    support_levels: Mapped[List[Decimal]] = mapped_column(
        ARRAY(Numeric(18, 5)),
        nullable=False,
        server_default=text("ARRAY[]::numeric[]")
    )
    resistance_levels: Mapped[List[Decimal]] = mapped_column(
        ARRAY(Numeric(18, 5)),
        nullable=False,
        server_default=text("ARRAY[]::numeric[]")
    )
    
    technical_summary: Mapped[str] = mapped_column(String, nullable=False)
    fundamental_summary: Mapped[str] = mapped_column(String, nullable=False)
    forecast_summary: Mapped[str] = mapped_column(String, nullable=False)
    
    ema_signal: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    rsi_value: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    macd_signal: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    timeframe: Mapped[str] = mapped_column(String, default="daily", server_default="daily", nullable=False)
    valid_until: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="SET NULL"),
        nullable=True
    )

    __table_args__ = (
        CheckConstraint(
            trend.in_(["Strong Bullish", "Bullish", "Neutral", "Bearish", "Strong Bearish"]),
            name="chk_forecast_trend"
        ),
        CheckConstraint(
            timeframe.in_(["daily", "weekly", "monthly"]),
            name="chk_forecast_timeframe"
        ),
        CheckConstraint(bullish_score >= 0, name="chk_forecast_bullish_min"),
        CheckConstraint(bullish_score <= 100, name="chk_forecast_bullish_max"),
        CheckConstraint(bearish_score >= 0, name="chk_forecast_bearish_min"),
        CheckConstraint(bearish_score <= 100, name="chk_forecast_bearish_max"),
    )

    # Relationships
    pair = relationship("Pair", back_populates="forecasts")
    creator = relationship("Profile")
