from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, Any
from sqlalchemy import String, DateTime, ForeignKey, Index, text, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import UUIDMixin

class AuditLog(Base, UUIDMixin):
    __tablename__ = "audit_logs"

    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    action: Mapped[str] = mapped_column(String, index=True, nullable=False)
    resource: Mapped[str] = mapped_column(String, nullable=False)
    resource_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    ip_address: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    metadata: Mapped[dict[str, Any]] = mapped_column(
        JSONB,
        default=dict,
        server_default=text("'{}'::jsonb"),
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    __table_args__ = (
        Index("idx_audit_logs_resource_res_id", "resource", "resource_id"),
        Index("idx_audit_logs_created_at_desc", created_at.desc()),
    )

    # Relationships
    user = relationship("Profile")
