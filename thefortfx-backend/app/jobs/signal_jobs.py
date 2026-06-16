from app.jobs.celery_app import celery_app, run_async
from app.core.database import get_session
from app.services.signal_service import SignalService
from app.core.logging import get_logger

logger = get_logger("app.jobs.signals")

@celery_app.task
def expire_signals():
    """Sweeps active signals and marks stale ones as expired."""
    logger.info("Sweeping DB for expired signals...")
    
    async def _sweep():
        async for db in get_session():
            service = SignalService(db)
            expired_count = await service.repo.expire_stale_signals()
            if expired_count > 0:
                await db.commit()
                await service._invalidate_caches(None)
                logger.info(f"Expired {expired_count} stale signals.")
            else:
                logger.info("No stale signals to expire.")
            break
            
    run_async(_sweep())
