import asyncio
import sys
import os

# Append project root to path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import get_session
from app.models.pair import Pair

PAIRS_DATA = [
    {"symbol": "EUR/USD", "slug": "eurusd", "display_name": "EURUSD", "base_currency": "EUR", "quote_currency": "USD", "category": "major", "description": "Euro / US Dollar", "pip_decimal": 4, "display_order": 1},
    {"symbol": "GBP/USD", "slug": "gbpusd", "display_name": "GBPUSD", "base_currency": "GBP", "quote_currency": "USD", "category": "major", "description": "Great Britain Pound / US Dollar", "pip_decimal": 4, "display_order": 2},
    {"symbol": "USD/JPY", "slug": "usdjpy", "display_name": "USDJPY", "base_currency": "USD", "quote_currency": "JPY", "category": "major", "description": "US Dollar / Japanese Yen", "pip_decimal": 2, "display_order": 3},
    {"symbol": "AUD/USD", "slug": "audusd", "display_name": "AUDUSD", "base_currency": "AUD", "quote_currency": "USD", "category": "major", "description": "Australian Dollar / US Dollar", "pip_decimal": 4, "display_order": 4},
    {"symbol": "USD/CAD", "slug": "usdcad", "display_name": "USDCAD", "base_currency": "USD", "quote_currency": "CAD", "category": "major", "description": "US Dollar / Canadian Dollar", "pip_decimal": 4, "display_order": 5},
    {"symbol": "USD/CHF", "slug": "usdchf", "display_name": "USDCHF", "base_currency": "USD", "quote_currency": "CHF", "category": "major", "description": "US Dollar / Swiss Franc", "pip_decimal": 4, "display_order": 6},
    {"symbol": "NZD/USD", "slug": "nzdusd", "display_name": "NZDUSD", "base_currency": "NZD", "quote_currency": "USD", "category": "major", "description": "New Zealand Dollar / US Dollar", "pip_decimal": 4, "display_order": 7},
    {"symbol": "EUR/GBP", "slug": "eurgbp", "display_name": "EURGBP", "base_currency": "EUR", "quote_currency": "GBP", "category": "minor", "description": "Euro / Great Britain Pound", "pip_decimal": 4, "display_order": 8},
    {"symbol": "EUR/JPY", "slug": "eurjpy", "display_name": "EURJPY", "base_currency": "EUR", "quote_currency": "JPY", "category": "minor", "description": "Euro / Japanese Yen", "pip_decimal": 2, "display_order": 9},
    {"symbol": "GBP/JPY", "slug": "gbpjpy", "display_name": "GBPJPY", "base_currency": "GBP", "quote_currency": "JPY", "category": "minor", "description": "Great Britain Pound / Japanese Yen", "pip_decimal": 2, "display_order": 10},
    {"symbol": "AUD/JPY", "slug": "audjpy", "display_name": "AUDJPY", "base_currency": "AUD", "quote_currency": "JPY", "category": "minor", "description": "Australian Dollar / Japanese Yen", "pip_decimal": 2, "display_order": 11},
    {"symbol": "EUR/AUD", "slug": "euraud", "display_name": "EURAUD", "base_currency": "EUR", "quote_currency": "AUD", "category": "minor", "description": "Euro / Australian Dollar", "pip_decimal": 4, "display_order": 12},
    {"symbol": "XAU/USD", "slug": "xauusd", "display_name": "Gold", "base_currency": "XAU", "quote_currency": "USD", "category": "commodity", "description": "Gold Spot / US Dollar", "pip_decimal": 2, "display_order": 13},
    {"symbol": "XAG/USD", "slug": "xagusd", "display_name": "Silver", "base_currency": "XAG", "quote_currency": "USD", "category": "commodity", "description": "Silver Spot / US Dollar", "pip_decimal": 3, "display_order": 14},
    {"symbol": "WTI/USD", "slug": "wtiusd", "display_name": "Crude Oil", "base_currency": "WTI", "quote_currency": "USD", "category": "commodity", "description": "West Texas Intermediate Crude Oil", "pip_decimal": 2, "display_order": 15},
    {"symbol": "BTC/USD", "slug": "btcusd", "display_name": "Bitcoin", "base_currency": "BTC", "quote_currency": "USD", "category": "crypto", "description": "Bitcoin / US Dollar", "pip_decimal": 2, "display_order": 16},
    {"symbol": "ETH/USD", "slug": "ethusd", "display_name": "Ethereum", "base_currency": "ETH", "quote_currency": "USD", "category": "crypto", "description": "Ethereum / US Dollar", "pip_decimal": 2, "display_order": 17},
    {"symbol": "SOL/USD", "slug": "solusd", "display_name": "Solana", "base_currency": "SOL", "quote_currency": "USD", "category": "crypto", "description": "Solana / US Dollar", "pip_decimal": 2, "display_order": 18},
]

async def seed():
    print("Seeding asset pairs...")
    async for db in get_session():
        from sqlalchemy import select
        for data in PAIRS_DATA:
            existing = await db.execute(select(Pair).where(Pair.symbol == data["symbol"]))
            if not existing.scalar_one_or_none():
                pair = Pair(**data)
                db.add(pair)
                print(f"Added pair: {data['symbol']}")
        await db.commit()
        break
    print("Seeding complete.")

if __name__ == "__main__":
    asyncio.run(seed())
