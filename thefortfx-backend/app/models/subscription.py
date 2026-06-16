from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Boolean, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin

class Subscription(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "subscriptions"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    stripe_customer_id: Mapped[Optional[str]] = mapped_column(String, unique=True, nullable=True)
    stripe_subscription_id: Mapped[Optional[str]] = mapped_column(String, unique=True, index=True, nullable=True)
    
    plan: Mapped[str] = mapped_column(String, default="free", server_default="free", nullable=False)
    status: Mapped[str] = mapped_column(String, default="active", server_default="active", index=True, nullable=False)
    
    current_period_start: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    current_period_end: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    cancel_at_period_end: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false", nullable=False)

    __table_args__ = (
        CheckConstraint(plan.in_(["free", "premium", "agency"]), name="chk_subscription_plan"),
        CheckConstraint(status.in_(["active", "cancelled", "past_due", "trialing"]), name="chk_subscription_status"),
    )

    # Relationships
    user = relationship("Profile", back_populates="subscription")
