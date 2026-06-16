from __future__ import annotations
from typing import Any, Optional
import orjson
import redis.asyncio as aioredis

from app.config import get_settings
from app.core.logging import get_logger

logger = get_logger("app.core.redis")
settings = get_settings()

class RedisClient:
    """Wrapper class around redis.asyncio.Redis providing helper caching methods."""
    def __init__(self) -> None:
        self.redis: Optional[aioredis.Redis] = None

    async def init(self) -> None:
        """Initializes the Redis connection."""
        logger.info("Initializing Redis connection...")
        try:
            self.redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
            await self.redis.ping()
            logger.info("Redis connection verified successfully.")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            raise e

    async def close(self) -> None:
        """Closes the Redis connection."""
        if self.redis:
            logger.info("Closing Redis connection...")
            await self.redis.close()
            logger.info("Redis connection closed.")

    async def get_cached(self, key: str) -> Optional[Any]:
        """Gets a deserialized JSON value from Redis."""
        if not self.redis:
            logger.warning("Redis client not initialized")
            return None
        try:
            val = await self.redis.get(key)
            if val:
                return orjson.loads(val)
        except Exception as e:
            logger.error(f"Redis get cache error for key {key}: {e}")
        return None

    async def set_cached(self, key: str, value: Any, ttl: int) -> bool:
        """Serializes and saves a value to Redis with a TTL in seconds."""
        if not self.redis:
            logger.warning("Redis client not initialized")
            return False
        try:
            serialized = orjson.dumps(value).decode("utf-8")
            await self.redis.set(key, serialized, ex=ttl)
            return True
        except Exception as e:
            logger.error(f"Redis set cache error for key {key}: {e}")
        return False

    async def delete_cached(self, key: str) -> bool:
        """Deletes a key from Redis."""
        if not self.redis:
            return False
        try:
            await self.redis.delete(key)
            return True
        except Exception as e:
            logger.error(f"Redis delete cache error for key {key}: {e}")
        return False

    async def delete_pattern(self, pattern: str) -> bool:
        """Deletes all keys matching the given pattern (e.g. 'signals:*')."""
        if not self.redis:
            return False
        try:
            keys = await self.redis.keys(pattern)
            if keys:
                await self.redis.delete(*keys)
            return True
        except Exception as e:
            logger.error(f"Redis delete pattern error for pattern {pattern}: {e}")
        return False

# Global instance to be used across the app
redis_client = RedisClient()

async def init_redis() -> None:
    """Helper function to initialize the global Redis client."""
    await redis_client.init()

async def close_redis() -> None:
    """Helper function to close the global Redis client."""
    await redis_client.close()
