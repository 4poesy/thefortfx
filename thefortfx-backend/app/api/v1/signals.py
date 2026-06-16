from typing import Optional, List
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.dependencies import get_db, get_current_user, PaginationParams
from app.core.security import require_role
from app.models.user import Profile
from app.models.signal import Signal
from app.models.pair import Pair
from app.schemas.signal import SignalResponse, SignalCreate, SignalUpdate, SignalHistoryResponse
from app.schemas.common import BaseResponse, PaginatedResponse
from app.services.signal_service import SignalService

router = APIRouter()

@router.get("", response_model=PaginatedResponse[SignalResponse])
async def get_signals(
    direction: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    min_confidence: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    params: PaginationParams = Depends(),
    db: AsyncSession = Depends(get_db)
):
    sig_service = SignalService(db)
    items, total = await sig_service.get_active_signals(
        direction=direction,
        risk_level=risk_level,
        min_confidence=min_confidence,
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

@router.get("/active", response_model=PaginatedResponse[SignalResponse])
async def get_active_signals(
    direction: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    min_confidence: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    params: PaginationParams = Depends(),
    db: AsyncSession = Depends(get_db)
):
    sig_service = SignalService(db)
    items, total = await sig_service.get_active_signals(
        direction=direction,
        risk_level=risk_level,
        min_confidence=min_confidence,
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

@router.get("/history", response_model=PaginatedResponse[SignalResponse])
async def get_signal_history_list(
    params: PaginationParams = Depends(),
    db: AsyncSession = Depends(get_db)
):
    skip = (params.page - 1) * params.limit
    query = select(Signal).join(Pair).where(Signal.status != "active")
    
    # Count query
    count_query = select(func.count()).select_from(query.subquery())
    count_res = await db.execute(count_query)
    total = count_res.scalar_one()
    
    # Selection query
    query = query.options(selectinload(Signal.pair)).order_by(Signal.created_at.desc()).offset(skip).limit(params.limit)
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

@router.get("/{id}", response_model=BaseResponse[SignalResponse])
async def get_signal(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    query = select(Signal).where(Signal.id == id).options(selectinload(Signal.pair))
    res = await db.execute(query)
    signal = res.scalar_one_or_none()
    if not signal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Signal not found")
    return BaseResponse(data=signal)

@router.get("/{id}/history", response_model=BaseResponse[List[SignalHistoryResponse]])
async def get_signal_changelogs(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    sig_service = SignalService(db)
    history = await sig_service.get_signal_history(id)
    return BaseResponse(data=history)

@router.post("", response_model=BaseResponse[SignalResponse], status_code=status.HTTP_201_CREATED)
async def create_signal(
    schema: SignalCreate,
    admin: Profile = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    sig_service = SignalService(db)
    signal = await sig_service.create_signal(schema, creator_id=admin.id)
    await db.commit()
    
    # Load relationships for response
    query = select(Signal).where(Signal.id == signal.id).options(selectinload(Signal.pair))
    res = await db.execute(query)
    signal_with_relation = res.scalar_one()
    
    # Trigger active alerts check
    from app.services.alert_service import AlertService
    alert_service = AlertService(db)
    await alert_service.check_and_trigger_signals(signal_with_relation)
    
    return BaseResponse(data=signal_with_relation, message="Signal created successfully")

@router.put("/{id}", response_model=BaseResponse[SignalResponse])
async def update_signal(
    id: uuid.UUID,
    schema: SignalUpdate,
    admin: Profile = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    sig_service = SignalService(db)
    updated = await sig_service.update_signal(id, schema, changer_id=admin.id)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Signal not found")
    await db.commit()
    
    # Load relationships for response
    query = select(Signal).where(Signal.id == updated.id).options(selectinload(Signal.pair))
    res = await db.execute(query)
    signal_with_relation = res.scalar_one()
    
    return BaseResponse(data=signal_with_relation, message="Signal updated successfully")

@router.delete("/{id}", response_model=BaseResponse[dict])
async def delete_signal(
    id: uuid.UUID,
    admin: Profile = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    sig_service = SignalService(db)
    success = await sig_service.delete_signal(id, changer_id=admin.id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Signal not found")
    await db.commit()
    return BaseResponse(data={}, message="Signal deleted/cancelled successfully")
