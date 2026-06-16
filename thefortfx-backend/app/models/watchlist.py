from __future__ import annotations
import uuid
from datetime import datetime
from sqlalchemy import ForeignKey, DateTime, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import UUIDMixin

class Watchlist(Base, UUIDMixin):
    __tablename__ = "watchlists"

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
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    __table_args__ = (
        UniqueConstraint("user_id", "pair_id", name="uq_watchlist_user_pair"),
    )

    # Relationships
    user = relationship("Profile", back_populates="watchlists")
    pair = relationship("Pair", back_populates="watchlists")
