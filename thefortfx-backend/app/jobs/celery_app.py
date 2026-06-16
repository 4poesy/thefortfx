import asyncio
from celery import Celery
from celery.schedules import crontab
from app.config import get_settings

settings = get_settings()

celery_app = Celery(
    "thefortfx_jobs",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=[
        "app.jobs.signal_jobs",
        "app.jobs.forecast_jobs",
        "app.jobs.sentiment_jobs",
        "app.jobs.calendar_jobs",
        "app.jobs.opportunity_jobs",
        "app.jobs.news_jobs",
        "app.jobs.alert_jobs",
        "app.jobs.analytics_jobs",
    ]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# Beat schedules
celery_app.conf.beat_schedule = {
    "recalculate-opportunity-scores": {
        "task": "app.jobs.opportunity_jobs.recalculate_opportunities",
        "schedule": 600.0,
    },
    "expire-stale-signals": {
        "task": "app.jobs.signal_jobs.expire_signals",
        "schedule": 900.0,
    },
    "sync-sentiment-data": {
        "task": "app.jobs.sentiment_jobs.sync_sentiment",
        "schedule": 1800.0,
    },
    "sync-news-articles": {
        "task": "app.jobs.news_jobs.sync_news",
        "schedule": 1800.0,
    },
    "sync-economic-calendar": {
        "task": "app.jobs.calendar_jobs.sync_calendar",
        "schedule": 3600.0,
    },
    "refresh-market-forecasts": {
        "task": "app.jobs.forecast_jobs.refresh_forecasts",
        "schedule": 3600.0,
    },
    "process-alert-deliveries": {
        "task": "app.jobs.alert_jobs.process_alerts",
        "schedule": 300.0,
    },
    "aggregate-platform-analytics": {
        "task": "app.jobs.analytics_jobs.run_daily_analytics",
        "schedule": crontab(hour=0, minute=0),
    }
}

def run_async(coro):
    """Helper to run async coroutines in Celery tasks."""
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coro)
