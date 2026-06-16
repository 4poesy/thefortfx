from typing import Optional, List
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.dependencies import get_db, get_current_user, PaginationParams
from app.core.security import require_role
from app.models.user import Profile
from app.models.forecast import Forecast
from app.models.pair import Pair
from app.schemas.forecast import ForecastResponse, ForecastCreate, ForecastUpdate
from app.schemas.common import BaseResponse, PaginatedResponse
from app.services.forecast_service import ForecastService

router = APIRouter()

@router.get("", response_model=PaginatedResponse[ForecastResponse])
async def get_forecasts(
    trend: Optional[str] = Query(None),
    timeframe: str = Query("daily"),
    category: Optional[str] = Query(None),
    params: PaginationParams = Depends(),
    db: AsyncSession = Depends(get_db)
):
    fc_service = ForecastService(db)
    items, total = await fc_service.get_all_forecasts(
        trend=trend,
        timeframe=timeframe,
        category=category,
        page=params.page,
        limit=params.limit
    )
    
    total_pages = (total + params.limit - 1) // params.limit
    return PaginatedResponse(
        data=items,
        total=total,
        page=params.page,
        limit=params.limit,
        total_pages=total_pages,
        has_next=params.page < total_pages,
        has_prev=params.page > 1
    )

@router.get("/{slug_or_id}", response_model=BaseResponse[ForecastResponse])
async def get_forecast(slug_or_id: str, db: AsyncSession = Depends(get_db)):
    try:
        uuid_val = uuid.UUID(slug_or_id)
        query = select(Forecast).where(Forecast.id == uuid_val)
    except ValueError:
        query = (
            select(Forecast)
            .join(Pair)
            .where(Pair.slug == slug_or_id.lower())
            .order_by(Forecast.created_at.desc())
            .limit(1)
        )
    query = query.options(selectinload(Forecast.pair))
    res = await db.execute(query)
    forecast = res.scalar_one_or_none()
    if not forecast:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Forecast not found")
    return BaseResponse(data=forecast)

@router.get("/{slug}/{timeframe}", response_model=BaseResponse[ForecastResponse])
async def get_timeframe_forecast(
    slug: str,
    timeframe: str,
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Forecast)
        .join(Pair)
        .where(Pair.slug == slug.lower())
        .where(Forecast.timeframe == timeframe.lower())
        .order_by(Forecast.created_at.desc())
        .limit(1)
    )
    query = query.options(selectinload(Forecast.pair))
    res = await db.execute(query)
    forecast = res.scalar_one_or_none()
    if not forecast:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Forecast for '{slug}' with timeframe '{timeframe}' not found"
        )
    return BaseResponse(data=forecast)

@router.post("", response_model=BaseResponse[ForecastResponse], status_code=status.HTTP_201_CREATED)
async def create_forecast(
    schema: ForecastCreate,
    admin: Profile = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    fc_service = ForecastService(db)
    forecast = await fc_service.create_forecast(schema, creator_id=admin.id)
    await db.commit()
    
    query = select(Forecast).where(Forecast.id == forecast.id).options(selectinload(Forecast.pair))
    res = await db.execute(query)
    forecast_with_relation = res.scalar_one()
    
    return BaseResponse(data=forecast_with_relation, message="Forecast created successfully")

@router.put("/{id}", response_model=BaseResponse[ForecastResponse])
async def update_forecast(
    id: uuid.UUID,
    schema: ForecastUpdate,
    admin: Profile = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    fc_service = ForecastService(db)
    updated = await fc_service.update_forecast(id, schema)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Forecast not found")
    await db.commit()
    
    query = select(Forecast).where(Forecast.id == updated.id).options(selectinload(Forecast.pair))
    res = await db.execute(query)
    forecast_with_relation = res.scalar_one()
    
    return BaseResponse(data=forecast_with_relation, message="Forecast updated successfully")

@router.delete("/{id}", response_model=BaseResponse[dict])
async def delete_forecast(
    id: uuid.UUID,
    admin: Profile = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    fc_service = ForecastService(db)
    success = await fc_service.delete_forecast(id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Forecast not found")
    await db.commit()
    return BaseResponse(data={}, message="Forecast deleted successfully")
