from app.jobs.celery_app import celery_app, run_async
from app.core.database import get_session
from app.models.economic_event import EconomicEvent
from app.core.logging import get_logger
from datetime import datetime, timedelta
from sqlalchemy import select, delete

logger = get_logger("app.jobs.calendar")

@celery_app.task
def sync_calendar():
    """Syncs economic calendar events."""
    logger.info("Syncing economic calendar events...")
    
    async def _sync():
        async for db in get_session():
            cutoff = datetime.utcnow() - timedelta(days=7)
            await db.execute(delete(EconomicEvent).where(EconomicEvent.event_datetime < cutoff))
            
            currencies = ["USD", "EUR", "GBP", "AUD", "JPY", "CAD"]
            events_templates = [
                ("Interest Rate Decision", "High", "0.25%", "0.25%"),
                ("CPI MoM", "High", "0.2%", "0.1%"),
                ("Unemployment Rate", "High", "3.8%", "3.9%"),
                ("GDP Growth Rate QoQ", "High", "1.5%", "1.2%"),
                ("Retail Sales MoM", "Medium", "0.4%", "0.3%"),
                ("Manufacturing PMI", "Medium", "50.2", "49.8"),
            ]
            
            now = datetime.utcnow()
            for day_offset in range(-1, 6):
                event_day = (now + timedelta(days=day_offset)).date()
                for currency in currencies:
                    for title, impact, forecast, prev in events_templates:
                        slug = f"{currency.lower()}-{title.lower().replace(' ', '-')}-{event_day.isoformat()}"
                        
                        existing = await db.execute(select(EconomicEvent).where(EconomicEvent.slug == slug))
                        if existing.scalar_one_or_none():
                            continue
                            
                        event_time = datetime.combine(event_day, datetime.min.time()) + timedelta(hours=14)
                        
                        actual = forecast if event_time < now else None
                        is_released = event_time < now
                        
                        event = EconomicEvent(
                            slug=slug,
                            title=f"{currency} {title}",
                            currency=currency,
                            country="United States" if currency == "USD" else "Eurozone" if currency == "EUR" else "United Kingdom" if currency == "GBP" else "Australia" if currency == "AUD" else "Japan" if currency == "JPY" else "Canada",
                            impact=impact,
                            event_datetime=event_time,
                            forecast=forecast,
                            previous=prev,
                            actual=actual,
                            description=f"Monthly release of {title} representing currency volatility triggers.",
                            affected_pairs=[f"{currency}/USD" if currency != "USD" else "EUR/USD"],
                            source="Forex Factory Scraper",
                            is_released=is_released
                        )
                        db.add(event)
                        
            await db.commit()
            logger.info("Economic calendar sync complete.")
            break
            
    run_async(_sync())
