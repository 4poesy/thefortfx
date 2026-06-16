from app.jobs.celery_app import celery_app, run_async
from app.core.database import get_session
from app.services.opportunity_engine import OpportunityEngine
from app.core.logging import get_logger

logger = get_logger("app.jobs.opportunities")

@celery_app.task
def recalculate_opportunities():
    """Triggers the opportunity scoring engine to recalculate rankings."""
    logger.info("Recalculating opportunity scores...")
    
    async def _recalc():
        async for db in get_session():
            engine = OpportunityEngine()
            await engine.recalculate_all(db)
            await db.commit()
            logger.info("Opportunity scores recalculated successfully.")
            break
            
    run_async(_recalc())
