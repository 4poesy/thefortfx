from __future__ import annotations
import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Boolean, DateTime, CheckConstraint, text
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin

class Profile(Base, TimestampMixin):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String, default="", server_default="")
    avatar_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    role: Mapped[str] = mapped_column(
        String,
        default="free",
        server_default="free",
        index=True
    )
    country: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    timezone: Mapped[str] = mapped_column(String, default="UTC", server_default="UTC")
    experience_level: Mapped[str] = mapped_column(
        String,
        default="beginner",
        server_default="beginner"
    )
    risk_appetite: Mapped[str] = mapped_column(
        String,
        default="medium",
        server_default="medium"
    )
    preferred_pairs: Mapped[List[str]] = mapped_column(
        ARRAY(String),
        default=list,
        server_default=text("ARRAY[]::varchar[]")
    )
    telegram_chat_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    webhook_secret: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    last_seen_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        CheckConstraint(role.in_(["free", "premium", "agency", "admin"]), name="chk_profile_role"),
        CheckConstraint(experience_level.in_(["beginner", "intermediate", "advanced"]), name="chk_profile_experience"),
        CheckConstraint(risk_appetite.in_(["low", "medium", "high"]), name="chk_profile_risk"),
    )

    # Relationships
    watchlists = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="user", cascade="all, delete-orphan")
    journal_entries = relationship("JournalEntry", back_populates="user", cascade="all, delete-orphan")
    subscription = relationship("Subscription", back_populates="user", uselist=False, cascade="all, delete-orphan")
