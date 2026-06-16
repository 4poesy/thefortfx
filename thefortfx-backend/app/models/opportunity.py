from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey, CheckConstraint, Index, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import UUIDMixin

class Opportunity(Base, UUIDMixin):
    __tablename__ = "opportunities"

    pair_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("pairs.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    signal_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("signals.id", ondelete="SET NULL"),
        nullable=True
    )
    
    opportunity_score: Mapped[int] = mapped_column(Integer, nullable=False)
    trend_score: Mapped[int] = mapped_column(Integer, nullable=False)
    sentiment_score: Mapped[int] = mapped_column(Integer, nullable=False)
    consensus_score: Mapped[int] = mapped_column(Integer, nullable=False)
    volatility_score: Mapped[int] = mapped_column(Integer, nullable=False)
    news_risk_score: Mapped[int] = mapped_column(Integer, nullable=False)
    
    trend: Mapped[str] = mapped_column(String, nullable=False)
    news_risk: Mapped[str] = mapped_column(String, nullable=False)
    sentiment: Mapped[str] = mapped_column(String, nullable=False)
    direction: Mapped[str] = mapped_column(String, nullable=False)
    
    rank: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    is_top: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false", nullable=False)
    calculated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    valid_until: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True
    )

    __table_args__ = (
        CheckConstraint(news_risk.in_(["Low", "Medium", "High"]), name="chk_opp_news_risk"),
        CheckConstraint(direction.in_(["BUY", "SELL", "NEUTRAL"]), name="chk_opp_direction"),
        CheckConstraint(opportunity_score >= 0, name="chk_opp_score_min"),
        CheckConstraint(opportunity_score <= 100, name="chk_opp_score_max"),
        Index("idx_opportunities_score_desc", opportunity_score.desc()),
        Index("idx_opportunities_top", "pair_id", postgresql_where=is_top),
    )

    # Relationships
    pair = relationship("Pair", back_populates="opportunities")
    signal = relationship("Signal")
