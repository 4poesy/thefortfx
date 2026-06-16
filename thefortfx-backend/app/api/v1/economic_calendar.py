from typing import Optional, List
import uuid
from datetime import datetime, date, time
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.dependencies import get_db, PaginationParams
from app.models.economic_event import EconomicEvent
from app.schemas.economic_event import EconomicEventResponse
from app.schemas.common import BaseResponse, PaginatedResponse

router = APIRouter()

@router.get("", response_model=PaginatedResponse[EconomicEventResponse])
async def get_calendar(
    currency: Optional[str] = Query(None),
    impact: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    params: PaginationParams = Depends(),
    db: AsyncSession = Depends(get_db)
):
    skip = (params.page - 1) * params.limit
    query = select(EconomicEvent)
    
    if currency:
        query = query.where(EconomicEvent.currency == currency.upper())
    if impact:
        query = query.where(EconomicEvent.impact == impact)
    if date_from:
        query = query.where(EconomicEvent.event_datetime >= datetime.combine(date_from, time.min))
    if date_to:
        query = query.where(EconomicEvent.event_datetime <= datetime.combine(date_to, time.max))
        
    count_query = select(func.count()).select_from(query.subquery())
    count_res = await db.execute(count_query)
    total = count_res.scalar_one()
    
    query = query.order_by(EconomicEvent.event_datetime.asc()).offset(skip).limit(params.limit)
    res = await db.execute(query)
    items = list(res.scalars().all())
    
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

@router.get("/today", response_model=BaseResponse[List[EconomicEventResponse]])
async def get_today_events(
    currency: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    today_start = datetime.combine(date.today(), time.min)
    today_end = datetime.combine(date.today(), time.max)
    
    query = select(EconomicEvent).where(
        and_(
            EconomicEvent.event_datetime >= today_start,
            EconomicEvent.event_datetime <= today_end
        )
    )
    if currency:
        query = query.where(EconomicEvent.currency == currency.upper())
        
    query = query.order_by(EconomicEvent.event_datetime.asc())
    res = await db.execute(query)
    items = list(res.scalars().all())
    return BaseResponse(data=items)

@router.get("/upcoming", response_model=BaseResponse[List[EconomicEventResponse]])
async def get_upcoming_events(
    currency: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    now = datetime.utcnow()
    query = select(EconomicEvent).where(EconomicEvent.event_datetime >= now)
    if currency:
        query = query.where(EconomicEvent.currency == currency.upper())
        
    query = query.order_by(EconomicEvent.event_datetime.asc()).limit(limit)
    res = await db.execute(query)
    items = list(res.scalars().all())
    return BaseResponse(data=items)

@router.get("/{id}", response_model=BaseResponse[EconomicEventResponse])
async def get_event(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    query = select(EconomicEvent).where(EconomicEvent.id == id)
    res = await db.execute(query)
    event = res.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return BaseResponse(data=event)
