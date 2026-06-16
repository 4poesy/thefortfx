from __future__ import annotations
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional
from sqlalchemy import String, Numeric, DateTime, ForeignKey, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin

class JournalEntry(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "journal_entries"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    pair_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("pairs.id", ondelete="SET NULL"),
        nullable=True
    )
    
    pair_symbol: Mapped[str] = mapped_column(String, index=True, nullable=False)
    direction: Mapped[str] = mapped_column(String, nullable=False)
    
    entry_price: Mapped[Decimal] = mapped_column(Numeric(18, 5), nullable=False)
    exit_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 5), nullable=True)
    stop_loss: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 5), nullable=True)
    take_profit: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 5), nullable=True)
    lot_size: Mapped[Decimal] = mapped_column(Numeric(10, 4), nullable=False)
    
    pips_gained: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)
    profit_loss: Mapped[Optional[Decimal]] = mapped_column(Numeric(15, 2), nullable=True)
    r_multiple: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)
    
    outcome: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    setup: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    screenshot_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    trade_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    closed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        CheckConstraint(direction.in_(["BUY", "SELL"]), name="chk_journal_direction"),
        CheckConstraint(outcome.in_(["win", "loss", "breakeven", "open"]), name="chk_journal_outcome"),
        Index("idx_journal_trade_date_desc", trade_date.desc()),
    )

    # Relationships
    user = relationship("Profile", back_populates="journal_entries")
    pair = relationship("Pair")
