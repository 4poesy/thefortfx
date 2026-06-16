from __future__ import annotations
import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Boolean, DateTime, CheckConstraint, Index, text, func
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import UUIDMixin

class News(Base, UUIDMixin):
    __tablename__ = "news"

    slug: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    summary: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    source: Mapped[str] = mapped_column(String, nullable=False)
    source_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    impact: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    affected_pairs: Mapped[List[str]] = mapped_column(
        ARRAY(String),
        default=list,
        server_default=text("ARRAY[]::varchar[]")
    )
    tags: Mapped[List[str]] = mapped_column(
        ARRAY(String),
        default=list,
        server_default=text("ARRAY[]::varchar[]")
    )
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true", nullable=False)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint(impact.in_(["High", "Medium", "Low"]), name="chk_news_impact"),
        Index("idx_news_published_at_desc", published_at.desc()),
        Index("idx_news_tags_gin", "tags", postgresql_using="gin"),
        Index("idx_news_affected_pairs_gin", "affected_pairs", postgresql_using="gin"),
    )
