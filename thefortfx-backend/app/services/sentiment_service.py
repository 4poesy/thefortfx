from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import get_settings
from app.core.redis import redis_client
from app.repositories.base import BaseRepository
from app.repositories.pair import PairRepository
from app.models.sentiment import Sentiment
from app.models.pair import Pair
from app.schemas.sentiment import SentimentCreate

settings = get_settings()

class SentimentService:
    """Service layer coordinating Sentiment logs and caching."""
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = BaseRepository(Sentiment, db)
        self.pair_repo = PairRepository(db)

    async def get_all_sentiment(self, category: Optional[str] = None) -> List[Sentiment]:
        """Gets the latest sentiment reading for all active pairs, grouped optionally by category."""
        cache_key = f"sentiment:all:{category or 'all'}"
        cached = await redis_client.get_cached(cache_key)
        if cached:
            items = []
            for item in cached:
                pair_data = item.pop("pair", None)
                sent = Sentiment(**item)
                if pair_data:
                    sent.pair = Pair(**pair_data)
                items.append(sent)
            return items
            
        # Get active pairs and fetch the latest sentiment record for each
        active_pairs = await self.pair_repo.get_active_pairs(category)
        
        items = []
        for pair in active_pairs:
            query = (
                select(Sentiment)
                .where(Sentiment.pair_id == pair.id)
                .options(selectinload(Sentiment.pair))
                .order_by(Sentiment.recorded_at.desc())
                .limit(1)
            )
            result = await self.db.execute(query)
            latest = result.scalar_one_or_none()
            if latest:
                items.append(latest)
                
        # Cache for 30 minutes
        serialized = []
        for item in items:
            d = {c.name: getattr(item, c.name) for c in item.__table__.columns}
            if item.pair:
                d["pair"] = {c.name: getattr(item.pair, c.name) for c in item.pair.__table__.columns}
            serialized.append(d)
            
        await redis_client.set_cached(cache_key, serialized, ttl=settings.REDIS_CACHE_TTL_SENTIMENT)
        return items

    async def get_sentiment_by_slug(self, slug: str) -> Optional[Sentiment]:
        """Gets the latest sentiment record for a specific pair slug (checks cache first)."""
        cache_key = f"sentiment:{slug.lower()}"
        cached = await redis_client.get_cached(cache_key)
        if cached:
            pair_data = cached.pop("pair", None)
            sent = Sentiment(**cached)
            if pair_data:
                sent.pair = Pair(**pair_data)
            return sent
            
        pair = await self.pair_repo.get_by_slug(slug)
        if not pair:
            return None
            
        query = (
            select(Sentiment)
            .where(Sentiment.pair_id == pair.id)
            .options(selectinload(Sentiment.pair))
            .order_by(Sentiment.recorded_at.desc())
            .limit(1)
        )
        result = await self.db.execute(query)
        sentiment = result.scalar_one_or_none()
        
        if sentiment:
            d = {c.name: getattr(sentiment, c.name) for c in sentiment.__table__.columns}
            if sentiment.pair:
                d["pair"] = {c.name: getattr(sentiment.pair, c.name) for c in sentiment.pair.__table__.columns}
            await redis_client.set_cached(cache_key, d, ttl=settings.REDIS_CACHE_TTL_SENTIMENT)
            
        return sentiment

    async def create_or_update(self, schema: SentimentCreate) -> Sentiment:
        """Saves a new sentiment reading and invalidates old caches."""
        sentiment_data = schema.model_dump()
        sentiment = await self.repo.create(sentiment_data)
        
        pair = await self.pair_repo.get(sentiment.pair_id)
        if pair:
            await redis_client.delete_pattern("sentiment:*")
            await redis_client.delete_cached(f"sentiment:{pair.slug.lower()}")
            
        return sentiment
