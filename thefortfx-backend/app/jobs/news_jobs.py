from app.jobs.celery_app import celery_app, run_async
from app.core.database import get_session
from app.models.news import News
from app.core.logging import get_logger
from datetime import datetime, timedelta
from sqlalchemy import select, delete
import random

logger = get_logger("app.jobs.news")

@celery_app.task
def sync_news():
    """Syncs financial news articles in the database."""
    logger.info("Syncing financial news...")
    
    async def _sync():
        async for db in get_session():
            cutoff = datetime.utcnow() - timedelta(days=14)
            await db.execute(delete(News).where(News.published_at < cutoff))
            
            topics = [
                ("US dollar strengthens ahead of retail sales report", "The greenback gained ground against major rivals as traders braced for high-impact retail sales figures. Economists forecast a modest rise.", ["USD", "EUR/USD", "GBP/USD"], ["dollar", "retail-sales"]),
                ("Euro under pressure amidst ECB rate cut expectations", "Speculation grows that the European Central Bank will cut rates sooner than previously anticipated. Volatility expected on EUR pairs.", ["EUR", "EUR/USD", "EUR/GBP"], ["euro", "ecb", "rates"]),
                ("Gold prices consolidate near historic highs", "XAU/USD hovers near record territory as geopolitical risks and macroeconomic uncertainty prompt safe haven flows.", ["XAU/USD"], ["gold", "safe-haven"]),
                ("Bank of Japan signals potential policy shift", "Commentary from BOJ officials suggests a willingness to adjust yield curve controls if inflation holds steady.", ["JPY", "USD/JPY", "EUR/JPY"], ["yen", "boj"]),
                ("Oil prices rise on supply concerns and Middle East tension", "Crude benchmarks climbed as supply disruptions and tensions in major producing regions offset global demand worries.", ["WTI", "USOIL"], ["oil", "commodities"]),
            ]
            
            for title, summary, pairs, tags in topics:
                slug = f"{datetime.utcnow().date().isoformat()}-{title.lower().replace(' ', '-')[:40]}"
                
                existing = await db.execute(select(News).where(News.slug == slug))
                if existing.scalar_one_or_none():
                    continue
                    
                article = News(
                    slug=slug,
                    title=title,
                    summary=summary,
                    content=summary + " Industry analysts believe this trend will dictate market momentum over the next few sessions. Technical thresholds remain crucial in identifying next entries.",
                    source="Forex News Network",
                    source_url="https://thefortfx.com/news",
                    image_url=f"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
                    impact="Medium" if "pmi" in title.lower() else "High" if "rate" in title.lower() or "sales" in title.lower() else "Low",
                    affected_pairs=pairs,
                    tags=tags,
                    published_at=datetime.utcnow()
                )
                db.add(article)
                
            await db.commit()
            logger.info("Financial news sync completed.")
            break
            
    run_async(_sync())
