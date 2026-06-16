from __future__ import annotations
import uuid
from datetime import datetime
from decimal import Decimal
from typing import List, Optional, Any
from sqlalchemy import String, Integer, Numeric, Boolean, DateTime, ForeignKey, CheckConstraint, Index, text, func
from sqlalchemy.dialects.postgresql import ARRAY, UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import UUIDMixin

class Alert(Base, UUIDMixin):
    __tablename__ = "alerts"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    pair_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("pairs.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    alert_type: Mapped[str] = mapped_column(String, index=True, nullable=False)
    direction: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    min_confidence: Mapped[int] = mapped_column(Integer, default=0, server_default="0", nullable=False)
    
    price_level: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 5), nullable=True)
    price_condition: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    channels: Mapped[List[str]] = mapped_column(
        ARRAY(String),
        default=lambda: ["email"],
        server_default=text("ARRAY['email']::varchar[]")
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true", nullable=False)
    
    last_triggered: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    __table_args__ = (
        CheckConstraint(
            alert_type.in_(["signal", "forecast", "opportunity", "price"]),
            name="chk_alert_type"
        ),
        CheckConstraint(
            direction.in_(["BUY", "SELL", "NEUTRAL", "ANY"]),
            name="chk_alert_direction"
        ),
        CheckConstraint(
            price_condition.in_(["above", "below"]),
            name="chk_alert_price_condition"
        ),
        Index("idx_alerts_active", "user_id", "pair_id", postgresql_where=is_active),
    )

    # Relationships
    user = relationship("Profile", back_populates="alerts")
    pair = relationship("Pair", back_populates="alerts")
    deliveries = relationship("AlertDelivery", back_populates="alert", cascade="all, delete-orphan")


class AlertDelivery(Base, UUIDMixin):
    __tablename__ = "alert_deliveries"

    alert_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("alerts.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    channel: Mapped[str] = mapped_column(String, nullable=False)
    payload: Mapped[dict[str, Any]] = mapped_column(
        JSONB,
        default=dict,
        server_default=text("'{}'::jsonb"),
        nullable=False
    )
    status: Mapped[str] = mapped_column(String, default="sent", server_default="sent", nullable=False)
    delivered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    __table_args__ = (
        CheckConstraint(status.in_(["sent", "failed", "pending"]), name="chk_delivery_status"),
    )

    # Relationships
    alert = relationship("Alert", back_populates="deliveries")
    user = relationship("Profile")
