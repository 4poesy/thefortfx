from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.dependencies import get_db
from app.models.pair import Pair
from app.models.signal import Signal
from app.models.forecast import Forecast
from app.schemas.pair import PairResponse, PairDetailResponse
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
