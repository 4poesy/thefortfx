from __future__ import annotations
import uuid
from datetime import datetime, timedelta
from dataclasses import dataclass
from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.redis import redis_client
from app.models.pair import Pair
from app.models.signal import Signal
from app.models.sentiment import Sentiment
from app.models.economic_event import EconomicEvent
from app.repositories.pair import PairRepository
from app.repositories.opportunity import OpportunityRepository

@dataclass
class OpportunityResult:
    """Dataclass holding computed metrics and labels for a single pair's opportunity score."""
    opportunity_score: int
    trend_score: int
    sentiment_score: int
    consensus_score: int
    volatility_score: int
    news_risk_score: int
    trend: str
    news_risk: str
    sentiment: str
    direction: str

class OpportunityEngine:
    """Core scoring engine for calculating and ranking asset opportunities."""
    WEIGHTS = {
        'trend_score': 0.30,
        'sentiment_score': 0.25,
        'consensus_score': 0.25,
        'volatility_score': 0.10,
        'news_risk_score': 0.10,
    }

    async def calculate(self, pair: Pair, db: AsyncSession) -> OpportunityResult:
        """Calculates opportunity metrics for a single currency/asset pair."""
        # Get active signal for pair
        sig_query = (
            select(Signal)
            .where(Signal.pair_id == pair.id)
            .where(Signal.status == "active")
            .order_by(Signal.created_at.desc())
            .limit(1)
        )
        sig_res = await db.execute(sig_query)
        signal = sig_res.scalar_one_or_none()

        # Get latest sentiment
        sent_query = (
            select(Sentiment)
            .where(Sentiment.pair_id == pair.id)
            .order_by(Sentiment.recorded_at.desc())
            .limit(1)
        )
        sent_res = await db.execute(sent_query)
        sentiment = sent_res.scalar_one_or_none()

        # Get upcoming high-impact events within 6 hours that affect the pair's currencies
        now = datetime.utcnow()
        six_hours_later = now + timedelta(hours=6)
        
        event_query = select(func.count(EconomicEvent.id)).where(
            EconomicEvent.impact == "High",
            EconomicEvent.event_datetime >= now,
            EconomicEvent.event_datetime <= six_hours_later,
            EconomicEvent.currency.in_([pair.base_currency.upper(), pair.quote_currency.upper()])
        )
        event_res = await db.execute(event_query)
        high_impact_count = event_res.scalar_one() or 0

        # Calculate scores
        # 1. Trend Score
        if signal and signal.direction != "NEUTRAL":
            trend_score = signal.confidence
        else:
            trend_score = 30

        # 2. Sentiment Score
        if sentiment:
            sentiment_score = max(sentiment.retail_bullish_pct, sentiment.retail_bearish_pct)
        else:
            sentiment_score = 50

        # 3. Consensus Score
        if signal:
            consensus_score = signal.confidence
        else:
            consensus_score = 40

        # 4. Volatility Score (Default 70)
        volatility_score = 70

        # 5. News Risk Score
        if high_impact_count >= 2:
            news_risk_score = 20
        elif high_impact_count == 1:
            news_risk_score = 55
        else:
            news_risk_score = 90

        # Weighted final score
        raw_score = (
            trend_score * self.WEIGHTS["trend_score"] +
            sentiment_score * self.WEIGHTS["sentiment_score"] +
            consensus_score * self.WEIGHTS["consensus_score"] +
            volatility_score * self.WEIGHTS["volatility_score"] +
            news_risk_score * self.WEIGHTS["news_risk_score"]
        )
        final_score = int(round(min(100, max(0, raw_score))))

        # Derive labels
        news_risk_label = (
            "High" if news_risk_score < 40 else
            "Medium" if news_risk_score < 70 else "Low"
        )

        direction_val = signal.direction if signal else "NEUTRAL"
        
        if trend_score >= 85 and direction_val == "BUY":
            trend_label = "Strong Bullish"
        elif trend_score >= 65 and direction_val == "BUY":
            trend_label = "Bullish"
        elif trend_score >= 85 and direction_val == "SELL":
            trend_label = "Strong Bearish"
        elif trend_score >= 65 and direction_val == "SELL":
            trend_label = "Bearish"
        else:
            trend_label = "Neutral"

        return OpportunityResult(
            opportunity_score=final_score,
            trend_score=trend_score,
            sentiment_score=sentiment_score,
            consensus_score=consensus_score,
            volatility_score=volatility_score,
            news_risk_score=news_risk_score,
            trend=trend_label,
            news_risk=news_risk_label,
            sentiment=sentiment.overall_sentiment if sentiment else "Neutral",
            direction=direction_val
        )

    async def recalculate_all(self, db: AsyncSession) -> None:
        """Runs the opportunity calculator for all active pairs and updates the DB."""
        pair_repo = PairRepository(db)
        opp_repo = OpportunityRepository(db)
        
        # Get all active pairs
        active_pairs = await pair_repo.get_active_pairs()
        
        opportunities_data = []
        for pair in active_pairs:
            res = await self.calculate(pair, db)
            
            # Map result to dictionary
            opp_dict = {
                "pair_id": pair.id,
                "opportunity_score": res.opportunity_score,
                "trend_score": res.trend_score,
                "sentiment_score": res.sentiment_score,
                "consensus_score": res.consensus_score,
                "volatility_score": res.volatility_score,
                "news_risk_score": res.news_risk_score,
                "trend": res.trend,
                "news_risk": res.news_risk,
                "sentiment": res.sentiment,
                "direction": res.direction,
                "calculated_at": datetime.utcnow(),
                "valid_until": datetime.utcnow() + timedelta(minutes=10),
                "is_top": False
            }
            opportunities_data.append(opp_dict)
            
        # Rank by opportunity score descending
        opportunities_data.sort(key=lambda x: x["opportunity_score"], reverse=True)
        
        # Mark top 10 as is_top and assign rank
        for idx, opp in enumerate(opportunities_data):
            opp["rank"] = idx + 1
            if idx < 10:
                opp["is_top"] = True
                
        # Bulk upsert/replace to database
        await opp_repo.bulk_upsert(opportunities_data)
        
        # Invalidate opportunity caches
        await redis_client.delete_pattern("opportunities:*")
