from __future__ import annotations
from typing import Optional
from sqlalchemy import String, Integer, Boolean, CheckConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin

class Pair(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "pairs"

    symbol: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String, nullable=False)
    base_currency: Mapped[str] = mapped_column(String, nullable=False)
    quote_currency: Mapped[str] = mapped_column(String, nullable=False)
    category: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    pip_decimal: Mapped[int] = mapped_column(Integer, default=4, server_default="4")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    display_order: Mapped[int] = mapped_column(Integer, default=0, server_default="0")

    __table_args__ = (
        CheckConstraint(category.in_(["forex", "commodities", "crypto", "indices"]), name="chk_pair_category"),
        Index("idx_pairs_category_active", "category", postgresql_where=is_active),
    )

    # Relationships
    signals = relationship("Signal", back_populates="pair", cascade="all, delete-orphan")
    forecasts = relationship("Forecast", back_populates="pair", cascade="all, delete-orphan")
    sentiment = relationship("Sentiment", back_populates="pair", cascade="all, delete-orphan")
    opportunities = relationship("Opportunity", back_populates="pair", cascade="all, delete-orphan")
    watchlists = relationship("Watchlist", back_populates="pair", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="pair", cascade="all, delete-orphan")
