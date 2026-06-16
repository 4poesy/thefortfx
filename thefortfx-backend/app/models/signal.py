from __future__ import annotations
import uuid
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import String, Integer, Numeric, DateTime, ForeignKey, CheckConstraint, Index, text, func
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin

class Signal(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "signals"

    pair_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("pairs.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    direction: Mapped[str] = mapped_column(String, nullable=False, index=True)
    confidence: Mapped[int] = mapped_column(Integer, nullable=False)
    entry: Mapped[Decimal] = mapped_column(Numeric(18, 5), nullable=False)
    stop: Mapped[Decimal] = mapped_column(Numeric(18, 5), nullable=False)
    target: Mapped[Decimal] = mapped_column(Numeric(18, 5), nullable=False)
    risk_pips: Mapped[int] = mapped_column(Integer, nullable=False)
    reward_pips: Mapped[int] = mapped_column(Integer, nullable=False)
    r_multiple: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    risk_level: Mapped[str] = mapped_column(String, nullable=False)
    setup: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, default="active", server_default="active", nullable=False)
    
    bullish_pct: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    bearish_pct: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    opportunity_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    supporting_factors: Mapped[List[str]] = mapped_column(
        ARRAY(String),
        default=list,
        server_default=text("ARRAY[]::varchar[]")
    )
    
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="SET NULL"),
        nullable=True
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    __table_args__ = (
        CheckConstraint(direction.in_(["BUY", "SELL", "NEUTRAL"]), name="chk_signal_direction"),
        CheckConstraint(risk_level.in_(["Low", "Medium", "High"]), name="chk_signal_risk_level"),
        CheckConstraint(status.in_(["active", "expired", "cancelled", "hit_tp", "hit_sl"]), name="chk_signal_status"),
        CheckConstraint(confidence >= 0, name="chk_signal_confidence_min"),
        CheckConstraint(confidence <= 100, name="chk_signal_confidence_max"),
        Index("idx_signals_active", "pair_id", postgresql_where=(status == "active")),
        Index("idx_signals_confidence_desc", confidence.desc()),
        Index("idx_signals_updated_at_desc", "updated_at"),
    )

    # Relationships
    pair = relationship("Pair", back_populates="signals")
    creator = relationship("Profile")
    history = relationship("SignalHistory", back_populates="signal", cascade="all, delete-orphan")


class SignalHistory(Base, UUIDMixin):
    __tablename__ = "signal_history"

    signal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("signals.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    pair_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("pairs.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    direction: Mapped[str] = mapped_column(String, nullable=False)
    confidence: Mapped[int] = mapped_column(Integer, nullable=False)
    entry: Mapped[Decimal] = mapped_column(Numeric(18, 5), nullable=False)
    stop: Mapped[Decimal] = mapped_column(Numeric(18, 5), nullable=False)
    target: Mapped[Decimal] = mapped_column(Numeric(18, 5), nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False)
    
    changed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    changed_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="SET NULL"),
        nullable=True
    )

    # Relationships
    signal = relationship("Signal", back_populates="history")
    pair = relationship("Pair")
    changer = relationship("Profile")
