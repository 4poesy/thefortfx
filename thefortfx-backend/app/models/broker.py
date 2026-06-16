from __future__ import annotations
import uuid
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import String, Integer, Numeric, Boolean, CheckConstraint, Index, text
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin

class Broker(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "brokers"

    slug: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    logo_url: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    
    overall_score: Mapped[int] = mapped_column(Integer, nullable=False)
    trust_score: Mapped[int] = mapped_column(Integer, nullable=False)
    fees_score: Mapped[int] = mapped_column(Integer, nullable=False)
    platform_score: Mapped[int] = mapped_column(Integer, nullable=False)
    rating: Mapped[Decimal] = mapped_column(Numeric(3, 1), nullable=False)
    review_count: Mapped[int] = mapped_column(Integer, default=0, server_default="0", nullable=False)
    
    regulation: Mapped[List[str]] = mapped_column(
        ARRAY(String),
        default=list,
        server_default=text("ARRAY[]::varchar[]")
    )
    min_deposit: Mapped[int] = mapped_column(Integer, nullable=False)
    max_leverage: Mapped[str] = mapped_column(String, nullable=False)
    platforms: Mapped[List[str]] = mapped_column(
        ARRAY(String),
        default=list,
        server_default=text("ARRAY[]::varchar[]")
    )
    
    spread_eurusd: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    spread_gbpusd: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    spread_xauusd: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    
    founded: Mapped[int] = mapped_column(Integer, nullable=False)
    headquarters: Mapped[str] = mapped_column(String, nullable=False)
    pros: Mapped[List[str]] = mapped_column(
        ARRAY(String),
        default=list,
        server_default=text("ARRAY[]::varchar[]")
    )
    cons: Mapped[List[str]] = mapped_column(
        ARRAY(String),
        default=list,
        server_default=text("ARRAY[]::varchar[]")
    )
    
    affiliate_url: Mapped[str] = mapped_column(String, nullable=False)
    is_top_rated: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true", nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, server_default="0", nullable=False)

    __table_args__ = (
        CheckConstraint(overall_score >= 0, name="chk_broker_overall_score_min"),
        CheckConstraint(overall_score <= 100, name="chk_broker_overall_score_max"),
        CheckConstraint(trust_score >= 0, name="chk_broker_trust_score_min"),
        CheckConstraint(trust_score <= 100, name="chk_broker_trust_score_max"),
        CheckConstraint(fees_score >= 0, name="chk_broker_fees_score_min"),
        CheckConstraint(fees_score <= 100, name="chk_broker_fees_score_max"),
        CheckConstraint(platform_score >= 0, name="chk_broker_platform_score_min"),
        CheckConstraint(platform_score <= 100, name="chk_broker_platform_score_max"),
        CheckConstraint(rating >= 0, name="chk_broker_rating_min"),
        CheckConstraint(rating <= 5, name="chk_broker_rating_max"),
        Index("idx_brokers_rating_desc", rating.desc(), postgresql_where=is_active),
        Index("idx_brokers_top_rated", "is_top_rated", postgresql_where=is_top_rated),
    )
