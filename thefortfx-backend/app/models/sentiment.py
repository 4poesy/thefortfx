from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, DateTime, ForeignKey, CheckConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import UUIDMixin

class Sentiment(Base, UUIDMixin):
    __tablename__ = "sentiment"

    pair_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("pairs.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    retail_bullish_pct: Mapped[int] = mapped_column(Integer, nullable=False)
    retail_bearish_pct: Mapped[int] = mapped_column(Integer, nullable=False)
    institutional_bias: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    overall_sentiment: Mapped[str] = mapped_column(String, nullable=False)
    source: Mapped[str] = mapped_column(String, default="manual", server_default="manual", nullable=False)
    
    # We specify a compound index or single indexes. This one is indexed individually, recorded_at is indexed DESC in query helper
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    __table_args__ = (
        CheckConstraint(overall_sentiment.in_(["Bullish", "Bearish", "Neutral"]), name="chk_sentiment_overall"),
        CheckConstraint(institutional_bias.in_(["Bullish", "Bearish", "Neutral"]), name="chk_sentiment_institutional"),
        CheckConstraint(retail_bullish_pct >= 0, name="chk_retail_bullish_min"),
        CheckConstraint(retail_bullish_pct <= 100, name="chk_retail_bullish_max"),
        CheckConstraint(retail_bearish_pct >= 0, name="chk_retail_bearish_min"),
        CheckConstraint(retail_bearish_pct <= 100, name="chk_retail_bearish_max"),
    )

    # Relationships
    pair = relationship("Pair", back_populates="sentiment")
