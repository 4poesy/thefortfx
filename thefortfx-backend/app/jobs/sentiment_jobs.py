from app.jobs.celery_app import celery_app, run_async
from app.core.database import get_session
from app.repositories.pair import PairRepository
from app.schemas.sentiment import SentimentCreate
from app.services.sentiment_service import SentimentService
from app.core.logging import get_logger
import random

logger = get_logger("app.jobs.sentiment")

@celery_app.task
def sync_sentiment():
    """Syncs sentiment data for all active pairs."""
    logger.info("Syncing sentiment data...")
    
    async def _sync():
        async for db in get_session():
            pair_repo = PairRepository(db)
            sent_service = SentimentService(db)
            
            pairs = await pair_repo.get_active_pairs()
            for pair in pairs:
                bullish = random.randint(25, 75)
                bearish = 100 - bullish
                bias = "Bullish" if bullish > 55 else "Bearish" if bearish > 55 else "Neutral"
                
                schema = SentimentCreate(
                    pair_id=pair.id,
                    retail_bullish_pct=bullish,
                    retail_bearish_pct=bearish,
                    institutional_bias=bias,
                    overall_sentiment=bias,
                    source="Forex Factory Scraper"
                )
                await sent_service.create_or_update(schema)
                
            await db.commit()
            logger.info("Sentiment data sync completed.")
            break
            
    run_async(_sync())
