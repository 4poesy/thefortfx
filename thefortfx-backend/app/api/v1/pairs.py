from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.dependencies import get_db
from app.models.pair import Pair
from app.models.signal import Signal
from app.models.forecast import Forecast
from app.models.sentiment import Sentiment
from app.models.opportunity import Opportunity
from app.schemas.pair import PairResponse, PairDetailResponse
from app.schemas.signal import SignalResponse
from app.schemas.forecast import ForecastResponse
from app.schemas.sentiment import SentimentResponse
from app.schemas.opportunity import OpportunityResponse
from app.schemas.common import BaseResponse
from app.repositories.pair import PairRepository

router = APIRouter()

@router.get("", response_model=BaseResponse[List[PairResponse]])
async def get_pairs(
    category: Optional[str] = Query(None, description="Filter pairs by category"),
    db: AsyncSession = Depends(get_db)
):
    pair_repo = PairRepository(db)
    pairs = await pair_repo.get_active_pairs(category)
    return BaseResponse(data=pairs)

@router.get("/{slug}", response_model=BaseResponse[PairDetailResponse])
async def get_pair_detail(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    pair_repo = PairRepository(db)
    pair = await pair_repo.get_by_slug(slug)
    if not pair:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pair with slug '{slug}' not found."
        )

    # Get latest active signal
    sig_query = select(Signal).where(Signal.pair_id == pair.id, Signal.is_active == True).order_by(Signal.created_at.desc()).limit(1)
    sig_res = await db.execute(sig_query)
    latest_signal = sig_res.scalar_one_or_none()

    # Get latest forecast
    fore_query = select(Forecast).where(Forecast.pair_id == pair.id).order_by(Forecast.created_at.desc()).limit(1)
    fore_res = await db.execute(fore_query)
    latest_forecast = fore_res.scalar_one_or_none()

    # Construct and return response
    data = PairDetailResponse(
        id=pair.id,
        symbol=pair.symbol,
        slug=pair.slug,
        display_name=pair.display_name,
        base_currency=pair.base_currency,
        quote_currency=pair.quote_currency,
        category=pair.category,
        description=pair.description,
        pip_decimal=pair.pip_decimal,
        is_active=pair.is_active,
        display_order=pair.display_order,
        latest_signal=latest_signal,
        latest_forecast=latest_forecast
    )
    return BaseResponse(data=data)

@router.get("/{slug}/signal", response_model=BaseResponse[Optional[SignalResponse]])
async def get_pair_latest_signal(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    pair_repo = PairRepository(db)
    pair = await pair_repo.get_by_slug(slug)
    if not pair:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pair with slug '{slug}' not found."
        )

    sig_query = select(Signal).where(Signal.pair_id == pair.id, Signal.status == "active").order_by(Signal.created_at.desc()).limit(1)
    sig_res = await db.execute(sig_query)
    latest_signal = sig_res.scalar_one_or_none()
    return BaseResponse(data=latest_signal)

@router.get("/{slug}/forecast", response_model=BaseResponse[Optional[ForecastResponse]])
async def get_pair_latest_forecast(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    pair_repo = PairRepository(db)
    pair = await pair_repo.get_by_slug(slug)
    if not pair:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pair with slug '{slug}' not found."
        )

    fore_query = select(Forecast).where(Forecast.pair_id == pair.id).order_by(Forecast.created_at.desc()).limit(1)
    fore_res = await db.execute(fore_query)
    latest_forecast = fore_res.scalar_one_or_none()
    return BaseResponse(data=latest_forecast)

@router.get("/{slug}/sentiment", response_model=BaseResponse[Optional[SentimentResponse]])
async def get_pair_latest_sentiment(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    pair_repo = PairRepository(db)
    pair = await pair_repo.get_by_slug(slug)
    if not pair:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pair with slug '{slug}' not found."
        )

    sent_query = select(Sentiment).where(Sentiment.pair_id == pair.id).order_by(Sentiment.recorded_at.desc()).limit(1)
    sent_res = await db.execute(sent_query)
    latest_sentiment = sent_res.scalar_one_or_none()
    return BaseResponse(data=latest_sentiment)

@router.get("/{slug}/opportunities", response_model=BaseResponse[Optional[OpportunityResponse]])
async def get_pair_latest_opportunity(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    pair_repo = PairRepository(db)
    pair = await pair_repo.get_by_slug(slug)
    if not pair:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pair with slug '{slug}' not found."
        )

    opp_query = select(Opportunity).where(Opportunity.pair_id == pair.id).order_by(Opportunity.calculated_at.desc()).limit(1)
    opp_res = await db.execute(opp_query)
    latest_opp = opp_res.scalar_one_or_none()
    return BaseResponse(data=latest_opp)
