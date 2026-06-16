from __future__ import annotations
import uuid
import json
import re
from typing import Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import anthropic
import google.generativeai as genai

from app.config import get_settings
from app.core.redis import redis_client
from app.core.logging import get_logger
from app.schemas.ai import AITradeAnalysisRequest, AITradeAnalysisResponse
from app.models.pair import Pair
from app.models.signal import Signal
from app.models.forecast import Forecast
from app.models.sentiment import Sentiment
from app.repositories.pair import PairRepository

logger = get_logger("app.services.ai")
settings = get_settings()

class AIService:
    """Service layer interfacing Anthropic Claude and Google Gemini for intelligent market analytics."""
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.pair_repo = PairRepository(db)

    async def analyze_trade(self, request: AITradeAnalysisRequest, user_role: str) -> AITradeAnalysisResponse:
        """Analyzes a trade setup, routing premium users to Claude and free users to Gemini."""
        # 1. Gather context from our DB (latest active signal/sentiment for the pair)
        pair = await self.pair_repo.get_by_symbol(request.pair) or await self.pair_repo.get_by_slug(request.pair)
        signal_info = "No active signal found."
        sentiment_info = "No sentiment data found."
        
        if pair:
            sig_query = select(Signal).where(Signal.pair_id == pair.id, Signal.status == "active").order_by(Signal.created_at.desc()).limit(1)
            sig_res = await self.db.execute(sig_query)
            sig = sig_res.scalar_one_or_none()
            if sig:
                signal_info = f"Active {sig.direction} signal at {sig.entry} (TP: {sig.target}, SL: {sig.stop}, Confidence: {sig.confidence}%)"
                
            sent_query = select(Sentiment).where(Sentiment.pair_id == pair.id).order_by(Sentiment.recorded_at.desc()).limit(1)
            sent_res = await self.db.execute(sent_query)
            sent = sent_res.scalar_one_or_none()
            if sent:
                sentiment_info = f"Overall: {sent.overall_sentiment}, Retail: {sent.retail_bullish_pct}% Bullish / {sent.retail_bearish_pct}% Bearish, Institutional Bias: {sent.institutional_bias or 'Neutral'}"

        prompt = f"""You are a professional forex trading and financial analyst.
Analyze the following trade setup and respond ONLY with a valid JSON object matching the schema below.
Do not include markdown tags, code blocks, or extra text. Return ONLY the raw JSON string.

Schema:
{{
    "trade_score": int, (0-100 representing viability/strength)
    "confidence_rating": "High" | "Medium" | "Low",
    "risk_rating": "High" | "Medium" | "Low",
    "sentiment_assessment": "Short description of sentiment",
    "improvements": ["improvement tip 1", "improvement tip 2"],
    "warnings": ["warning 1", "warning 2"],
    "summary": "Detailed technical and fundamental overview of the setup"
}}

Trade Details:
- Pair/Asset: {request.pair}
- Direction: {request.direction}
- Entry Price: {request.entry}
- Stop Loss: {request.stop_loss}
- Take Profit: {request.take_profit}
- Timeframe: {request.timeframe}
- User Notes: {request.notes or "None"}

Current TheFortFX Market Data:
- Platform Signal Context: {signal_info}
- Platform Sentiment Context: {sentiment_info}
"""

        # Decide model based on role
        is_premium = user_role in ["premium", "agency", "admin"]
        response_text = ""
        
        try:
            if is_premium and settings.ANTHROPIC_API_KEY:
                # Use Claude Sonnet
                logger.info("Routing trade analysis to Anthropic Claude (Premium Route)")
                client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
                message = await client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=1500,
                    temperature=0.2,
                    system="You are a precise trading AI that output only valid JSON. Do not wrap output in ```json.",
                    messages=[{"role": "user", "content": prompt}]
                )
                response_text = message.content[0].text
            else:
                # Use Gemini Flash (Free Route / fallback)
                logger.info("Routing trade analysis to Google Gemini (Free Route)")
                if not settings.GEMINI_API_KEY:
                    raise ValueError("Gemini API key is not configured.")
                genai.configure(api_key=settings.GEMINI_API_KEY)
                model = genai.GenerativeModel("gemini-1.5-flash")
                # Async generation
                response = await model.generate_content_async(
                    prompt,
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.2,
                        response_mime_type="application/json"
                    )
                )
                response_text = response.text
                
            # Clean response text in case it wrapped in ```json
            cleaned_text = re.sub(r"^```json\s*|\s*```$", "", response_text.strip(), flags=re.MULTILINE)
            data = json.loads(cleaned_text)
            
            return AITradeAnalysisResponse(**data)
            
        except Exception as e:
            logger.error(f"AI trade analysis failed: {e}. Returning fallback response.")
            # Safe fallback response
            return AITradeAnalysisResponse(
                trade_score=50,
                confidence_rating="Medium",
                risk_rating="Medium",
                sentiment_assessment="Neutral (Unable to parse live AI feedback)",
                improvements=["Verify support/resistance levels manually.", "Double check upcoming high-impact economic news."],
                warnings=["AI analysis experienced a connection timeout/error. Please trade cautiously."],
                summary=f"Technical analysis fallback for {request.pair}. System was unable to reach the AI models to process this request. Net score default 50."
            )

    async def get_market_summary(self) -> str:
        """Generates a daily market summary (cached for 4 hours)."""
        cache_key = "ai:market_summary"
        cached = await redis_client.get_cached(cache_key)
        if cached:
            return cached

        prompt = """Provide a professional, concise, daily forex market summary (max 300 words).
Focus on major news headlines, currency trends (USD, EUR, GBP, JPY), and key upcoming economic calendar events for today.
Highlight any high-volatility pairs."""

        summary_text = "Market summary is temporarily unavailable."
        try:
            if settings.GEMINI_API_KEY:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                model = genai.GenerativeModel("gemini-1.5-flash")
                response = await model.generate_content_async(prompt)
                summary_text = response.text
            elif settings.ANTHROPIC_API_KEY:
                client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
                message = await client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=800,
                    temperature=0.7,
                    messages=[{"role": "user", "content": prompt}]
                )
                summary_text = message.content[0].text
                
            # Cache for 4 hours (14400 seconds)
            await redis_client.set_cached(cache_key, summary_text, ttl=14400)
        except Exception as e:
            logger.error(f"Failed to generate AI market summary: {e}")
            
        return summary_text

    async def get_pair_analysis(self, slug: str) -> str:
        """Generates asset-specific analytical views (cached for 1 hour)."""
        cache_key = f"ai:pair_analysis:{slug.lower()}"
        cached = await redis_client.get_cached(cache_key)
        if cached:
            return cached

        # Fetch pair context
        pair = await self.pair_repo.get_by_slug(slug)
        if not pair:
            return "Asset pair not found."

        # Grab latest signal, forecast, and sentiment
        sig_query = select(Signal).where(Signal.pair_id == pair.id, Signal.status == "active").order_by(Signal.created_at.desc()).limit(1)
        sig_res = await self.db.execute(sig_query)
        sig = sig_res.scalar_one_or_none()
        
        fc_query = select(Forecast).where(Forecast.pair_id == pair.id, Forecast.timeframe == "daily").order_by(Forecast.created_at.desc()).limit(1)
        fc_res = await self.db.execute(fc_query)
        fc = fc_res.scalar_one_or_none()
        
        sent_query = select(Sentiment).where(Sentiment.pair_id == pair.id).order_by(Sentiment.recorded_at.desc()).limit(1)
        sent_res = await self.db.execute(sent_query)
        sent = sent_res.scalar_one_or_none()

        context = f"Asset: {pair.symbol}\n"
        if sig:
            context += f"Signal: Active {sig.direction} signal at {sig.entry} (SL: {sig.stop}, TP: {sig.target}, Confidence: {sig.confidence}%)\n"
        if fc:
            context += f"Daily Forecast: Trend is {fc.trend} (Bullish Score: {fc.bullish_score}%, Bearish Score: {fc.bearish_score}%)\n"
        if sent:
            context += f"Sentiment: Retail {sent.retail_bullish_pct}% Bullish / {sent.retail_bearish_pct}% Bearish, Institutional bias {sent.institutional_bias or 'Neutral'}\n"

        prompt = f"""You are a professional forex technical analyst.
Provide a concise, 150-word analytical overview of the following asset pair based on this data:
{context}

Detail key support/resistance boundaries, overall directional bias, and immediate trade recommendations."""

        analysis_text = "Asset analysis is temporarily unavailable."
        try:
            if settings.GEMINI_API_KEY:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                model = genai.GenerativeModel("gemini-1.5-flash")
                response = await model.generate_content_async(prompt)
                analysis_text = response.text
            elif settings.ANTHROPIC_API_KEY:
                client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
                message = await client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=500,
                    temperature=0.5,
                    messages=[{"role": "user", "content": prompt}]
                )
                analysis_text = message.content[0].text
                
            # Cache for 1 hour (3600 seconds)
            await redis_client.set_cached(cache_key, analysis_text, ttl=3600)
        except Exception as e:
            logger.error(f"Failed to generate pair analysis for {slug}: {e}")
            
        return analysis_text
