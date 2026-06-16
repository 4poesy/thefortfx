from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from redis.asyncio import Redis

from app.dependencies import get_db, get_redis

router = APIRouter()

@router.get("", status_code=200)
async def health_check():
    return {"status": "ok", "message": "TheFortFX API is running"}

@router.get("/live", status_code=200)
async def live_check():
    return {"status": "alive"}

@router.get("/ready", status_code=200)
async def ready_check(
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

    if db_status != "ok" or redis_status != "ok":
        return {
            "status": "unhealthy",
            "services": {
                "database": db_status,
                "redis": redis_status
            }
        }

    return {
        "status": "healthy",
        "services": {
            "database": "ok",
            "redis": "ok"
        }
    }
