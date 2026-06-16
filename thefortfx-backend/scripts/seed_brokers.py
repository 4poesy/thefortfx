import asyncio
import sys
import os

# Append project root to path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import get_session
from app.models.broker import Broker

BROKERS_DATA = [
    {
        "slug": "icmarkets",
        "name": "IC Markets",
        "logo_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=150&q=80",
        "description": "IC Markets is a highly popular broker offering raw spreads, fast execution speeds, and support for MT4, MT5, and cTrader.",
        "overall_score": 92,
        "trust_score": 95,
        "fees_score": 90,
        "platform_score": 92,
        "rating": 4.8,
        "review_count": 1250,
        "regulation": ["ASIC", "CySEC", "FSA"],
        "min_deposit": 200,
        "max_leverage": "1:500",
        "platforms": ["MT4", "MT5", "cTrader"],
        "spread_eurusd": 0.1,
        "spread_gbpusd": 0.2,
        "spread_xauusd": 1.2,
        "founded": 2007,
        "headquarters": "Sydney, Australia",
        "pros": ["Extremely low spreads", "Support for cTrader", "Reliable regulations"],
        "cons": ["Limited educational resources", "Min deposit is slightly high"],
        "affiliate_url": "https://icmarkets.com/?camp=123",
        "is_top_rated": True,
        "display_order": 1
    },
    {
        "slug": "pepperstone",
        "name": "Pepperstone",
        "logo_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=150&q=80",
        "description": "Pepperstone is known for its award-winning customer support, lightning-fast execution, and institutional grade liquidity.",
        "overall_score": 90,
        "trust_score": 94,
        "fees_score": 88,
        "platform_score": 90,
        "rating": 4.7,
        "review_count": 940,
        "regulation": ["FCA", "ASIC", "BaFin", "DFSA"],
        "min_deposit": 0,
        "max_leverage": "1:500",
        "platforms": ["MT4", "MT5", "cTrader", "TradingView"],
        "spread_eurusd": 0.2,
        "spread_gbpusd": 0.3,
        "spread_xauusd": 1.4,
        "founded": 2010,
        "headquarters": "Melbourne, Australia",
        "pros": ["No minimum deposit requirement", "Integration with TradingView", "Highly regulated globally"],
        "cons": ["CFD instruments only", "Higher stock CFD commission"],
        "affiliate_url": "https://pepperstone.com/?aff=456",
        "is_top_rated": True,
        "display_order": 2
    },
    {
        "slug": "xm",
        "name": "XM Group",
        "logo_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=150&q=80",
        "description": "XM is a globally licensed broker offering tight spreads, zero re-quotes, and a massive library of education/market webinars.",
        "overall_score": 88,
        "trust_score": 89,
        "fees_score": 86,
        "platform_score": 87,
        "rating": 4.5,
        "review_count": 2100,
        "regulation": ["FCA", "ASIC", "DFSA", "IFSC"],
        "min_deposit": 5,
        "max_leverage": "1:1000",
        "platforms": ["MT4", "MT5"],
        "spread_eurusd": 0.6,
        "spread_gbpusd": 0.8,
        "spread_xauusd": 2.1,
        "founded": 2009,
        "headquarters": "Limassol, Cyprus",
        "pros": ["Very low minimum deposit ($5)", "High leverage availability", "Outstanding education resources"],
        "cons": ["Does not support cTrader", "Higher spreads on standard micro accounts"],
        "affiliate_url": "https://xm.com/?affiliate=789",
        "is_top_rated": False,
        "display_order": 3
    }
]

async def seed():
    print("Seeding brokers...")
    async for db in get_session():
        from sqlalchemy import select
        for data in BROKERS_DATA:
            existing = await db.execute(select(Broker).where(Broker.slug == data["slug"]))
            if not existing.scalar_one_or_none():
                broker = Broker(**data)
                db.add(broker)
                print(f"Added broker: {data['name']}")
        await db.commit()
        break
    print("Broker seeding complete.")

if __name__ == "__main__":
    asyncio.run(seed())
