from fastapi import APIRouter

from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.pairs import router as pairs_router
from app.api.v1.signals import router as signals_router
from app.api.v1.forecasts import router as forecasts_router
from app.api.v1.opportunities import router as opportunities_router
from app.api.v1.sentiment import router as sentiment_router
from app.api.v1.economic_calendar import router as calendar_router
from app.api.v1.news import router as news_router
from app.api.v1.calculators import router as calculators_router
from app.api.v1.watchlists import router as watchlists_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.journal import router as journal_router
from app.api.v1.brokers import router as brokers_router
from app.api.v1.subscriptions import router as subscriptions_router
from app.api.v1.ai import router as ai_router
from app.api.v1.admin import router as admin_router

api_router = APIRouter()

api_router.include_router(health_router, prefix="/health", tags=["health"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(pairs_router, prefix="/pairs", tags=["pairs"])
api_router.include_router(signals_router, prefix="/signals", tags=["signals"])
api_router.include_router(forecasts_router, prefix="/forecasts", tags=["forecasts"])
api_router.include_router(opportunities_router, prefix="/opportunities", tags=["opportunities"])
api_router.include_router(sentiment_router, prefix="/sentiment", tags=["sentiment"])
api_router.include_router(calendar_router, prefix="/economic-calendar", tags=["economic-calendar"])
api_router.include_router(news_router, prefix="/news", tags=["news"])
api_router.include_router(calculators_router, prefix="/calculators", tags=["calculators"])
api_router.include_router(watchlists_router, prefix="/watchlists", tags=["watchlists"])
api_router.include_router(alerts_router, prefix="/alerts", tags=["alerts"])
api_router.include_router(journal_router, prefix="/journal", tags=["journal"])
api_router.include_router(brokers_router, prefix="/brokers", tags=["brokers"])
api_router.include_router(subscriptions_router, prefix="/subscriptions", tags=["subscriptions"])
api_router.include_router(ai_router, prefix="/ai", tags=["ai"])
api_router.include_router(admin_router, prefix="/admin", tags=["admin"])
