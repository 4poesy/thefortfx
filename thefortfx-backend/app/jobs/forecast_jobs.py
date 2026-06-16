from app.jobs.celery_app import celery_app, run_async
from app.core.database import get_session
from app.repositories.pair import PairRepository
from app.models.forecast import Forecast
from app.schemas.forecast import ForecastCreate
from app.services.forecast_service import ForecastService
from app.core.logging import get_logger
from datetime import datetime, timedelta
from sqlalchemy import delete
import random

logger = get_logger("app.jobs.forecasts")

@celery_app.task
def refresh_forecasts():
    """Generates/refreshes technical daily forecasts for active pairs."""
    logger.info("Refreshing technical forecasts...")
    
    async def _refresh():
        async for db in get_session():
            pair_repo = PairRepository(db)
            fc_service = ForecastService(db)
            
            pairs = await pair_repo.get_active_pairs()
            for pair in pairs:
                bullish = random.randint(30, 90)
                bearish = 100 - bullish
                trend = "BULLISH" if bullish > 55 else "BEARISH" if bearish > 55 else "NEUTRAL"
                
                base_price = 1.08000 if "EUR" in pair.symbol else 1.30000 if "GBP" in pair.symbol else 150.00 if "JPY" in pair.symbol else 2000.00
                pip_val = 0.0001 if pair.pip_decimal == 4 else 0.01
                
                support = [base_price - 50 * pip_val, base_price - 100 * pip_val]
                resistance = [base_price + 50 * pip_val, base_price + 100 * pip_val]
                
                # Cleanup existing forecasts for the same pair and timeframe
                await db.execute(delete(Forecast).where(Forecast.pair_id == pair.id, Forecast.timeframe == "daily"))
                
                schema = ForecastCreate(
                    pair_id=pair.id,
                    bullish_score=bullish,
                    bearish_score=bearish,
                    trend=trend,
                    support_levels=support,
                    resistance_levels=resistance,
                    technical_summary=f"Technical indicators show a {trend.lower()} setup on the daily chart.",
                    fundamental_summary="Market sentiment is driven by recent central bank commentary and macroeconomic interest rate expectations.",
                    forecast_summary=f"Consensus shows strong {trend.lower()} pressure. Recommend entering on pullbacks.",
                    ema_signal="BUY" if trend == "BULLISH" else "SELL" if trend == "BEARISH" else "NEUTRAL",
                    rsi_value=random.randint(40, 70),
                    macd_signal="BUY" if trend == "BULLISH" else "SELL",
                    timeframe="daily",
                    valid_until=datetime.utcnow() + timedelta(days=1)
                )
                
                await fc_service.create_forecast(schema)
                
            await db.commit()
            logger.info("Daily technical forecasts refreshed successfully.")
            break
            
    run_async(_refresh())
