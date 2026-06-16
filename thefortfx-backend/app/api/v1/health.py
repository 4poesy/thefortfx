from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from redis.asyncio import Redis

from app.dependencies import get_db, get_redis
from app.config import get_settings

router = APIRouter()
settings = get_settings()

@router.get("", status_code=200)
async def health_check(
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis)
):
    # Check DB
    try:
        await db.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    # Check Redis
    try:
        await redis.ping()
        redis_status = "ok"
    except Exception as e:
        redis_status = f"unhealthy: {str(e)}"

    # Check AI
    ai_status = "ok" if (settings.GEMINI_API_KEY or settings.ANTHROPIC_API_KEY) else "unconfigured"

    status_str = "healthy" if (db_status == "ok" and redis_status == "ok") else "unhealthy"

    return {
        "status": status_str,
        "checks": {
            "db": db_status,
            "redis": redis_status,
            "ai": ai_status
        }
    }

@router.get("/live", status_code=200)
async def live_check():
    return {"alive": True}

@router.get("/ready", status_code=200)
async def ready_check(
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis)
):
    try:
        await db.execute(text("SELECT 1"))
        await redis.ping()
        ready = True
    except Exception:
        ready = False

    if not ready:
        return {"ready": False}

    return {"ready": True}
