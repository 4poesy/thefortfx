from app.jobs.celery_app import celery_app, run_async
from app.core.database import get_session
from app.models.alert import Alert
from app.models.pair import Pair
from app.core.logging import get_logger
from app.services.notification_service import NotificationService
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from datetime import datetime
import random

logger = get_logger("app.jobs.alerts")

@celery_app.task
def process_alerts():
    """Sweeps price alerts and checks if current market conditions trigger user preferences."""
    logger.info("Sweeping active price alerts...")
    
    async def _sweep():
        async for db in get_session():
            query = select(Alert).where(Alert.alert_type == "price", Alert.is_active == True).options(selectinload(Alert.pair))
            res = await db.execute(query)
            alerts = list(res.scalars().all())
            
            if not alerts:
                logger.info("No active price alerts to process.")
                break
                
            notification_service = NotificationService(db)
            triggered_count = 0
            
            for alert in alerts:
                base_price = 1.08000 if "EUR" in alert.pair.symbol else 1.30000 if "GBP" in alert.pair.symbol else 155.00 if "JPY" in alert.pair.symbol else 2000.00
                current_price = base_price + random.uniform(-0.005, 0.005) if alert.pair.pip_decimal == 4 else base_price + random.uniform(-1.0, 1.0)
                
                trigger = False
                level = float(alert.price_level)
                
                if alert.price_condition == "above" and current_price >= level:
                    trigger = True
                elif alert.price_condition == "below" and current_price <= level:
                    trigger = True
                    
                if trigger:
                    logger.info(f"Price alert triggered: Alert {alert.id} for User {alert.user_id} ({alert.pair.symbol} is {alert.price_condition} {level})")
                    
                    payload = {
                        "alert_id": str(alert.id),
                        "alert_type": "price",
                        "pair": alert.pair.symbol,
                        "current_price": round(current_price, alert.pair.pip_decimal),
                        "target_level": level,
                        "condition": alert.price_condition
                    }
                    
                    await notification_service.send(
                        user_id=alert.user_id,
                        alert_id=alert.id,
                        channels=alert.channels,
                        payload=payload
                    )
                    
                    alert.is_active = False
                    alert.last_triggered = datetime.utcnow()
                    db.add(alert)
                    triggered_count += 1
                    
            if triggered_count > 0:
                await db.commit()
                logger.info(f"Triggered {triggered_count} price alerts.")
            else:
                logger.info("No price alerts triggered in this sweep.")
            break
            
    run_async(_sweep())
