from functools import lru_cache
from typing import List, Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "TheFortFX"
    APP_ENV: str = "development"
    APP_URL: str = "https://thefortfx.com"
    API_URL: str = "https://api.thefortfx.com"
    SECRET_KEY: str = "change-me-openssl-rand-hex-32"
    DEBUG: bool = True

    # Supabase settings
    SUPABASE_URL: str = "https://xxxxx.supabase.co"
    SUPABASE_ANON_KEY: str = "your-anon-key"
    SUPABASE_SERVICE_ROLE_KEY: str = "your-service-role-key"
    SUPABASE_JWT_SECRET: str = "your-jwt-secret"

    # Database settings
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/thefortfx"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20

    # Redis settings
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_CACHE_TTL_SIGNALS: int = 900
    REDIS_CACHE_TTL_FORECASTS: int = 3600
    REDIS_CACHE_TTL_SENTIMENT: int = 1800
    REDIS_CACHE_TTL_CALENDAR: int = 3600
    REDIS_CACHE_TTL_OPPORTUNITIES: int = 600

    # Celery settings
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # AI settings
    ANTHROPIC_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None

    # External data settings
    FOREX_FACTORY_RSS_URL: str = "https://nfs.faireconomy.media/ff_calendar_thisweek.json"
    ALPHA_VANTAGE_API_KEY: Optional[str] = None
    TWELVE_DATA_API_KEY: Optional[str] = None
    NEWS_API_KEY: Optional[str] = None

    # Notification settings
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    TELEGRAM_CHANNEL_ID: Optional[str] = None
    RESEND_API_KEY: Optional[str] = None
    RESEND_FROM_EMAIL: str = "noreply@thefortfx.com"

    # Payment settings
    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None
    STRIPE_PRICE_ID_PRO: Optional[str] = None
    STRIPE_PRICE_ID_AGENCY: Optional[str] = None

    # IndexNow settings
    INDEXNOW_KEY: Optional[str] = None

    # Sentry settings
    SENTRY_DSN: Optional[str] = None

    # Security settings
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_AUTH_PER_MINUTE: int = 5

    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

@lru_cache()
def get_settings() -> Settings:
    """Returns a cached settings instance."""
    return Settings()
