from app.jobs.celery_app import celery_app, run_async
from app.core.database import get_session
from app.services.analytics_service import AnalyticsService
from app.core.logging import get_logger
from app.core.redis import redis_client

logger = get_logger("app.jobs.analytics")

@celery_app.task
def run_daily_analytics():
    """Runs daily platform metrics aggregation and caches findings in Redis."""
    logger.info("Running daily platform analytics aggregation...")
    
    async def _aggregate():
        async for db in get_session():
            service = AnalyticsService(db)
            platform = await service.get_platform_analytics()
            revenue = await service.get_revenue_metrics()
            
            combined = {**platform, **revenue}
            await redis_client.set_cached("analytics:dashboard", combined, ttl=86400)
            logger.info("Daily platform analytics aggregated and cached successfully.")
            break
            
    run_async(_aggregate())
