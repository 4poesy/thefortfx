from typing import Optional, List
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user, PaginationParams
from app.models.user import Profile
from app.schemas.journal import (
    JournalEntryResponse, JournalEntryCreate, JournalEntryUpdate,
    JournalStatsResponse, MonthlyStatsResponse, PairStatsResponse
)
from app.schemas.common import BaseResponse, PaginatedResponse
from app.services.journal_service import JournalService

router = APIRouter()

@router.get("", response_model=PaginatedResponse[JournalEntryResponse])
async def get_journal_entries(
    outcome: Optional[str] = Query(None),
    pair_symbol: Optional[str] = Query(None),
    date_from: Optional[datetime] = Query(None),
    params: PaginationParams = Depends(),
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = JournalService(db)
    items, total = await service.get_entries(
        user_id=current_user.id,
        outcome=outcome,
        pair_symbol=pair_symbol,
        date_from=date_from,
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

@router.post("", response_model=BaseResponse[JournalEntryResponse], status_code=status.HTTP_201_CREATED)
async def create_journal_entry(
    schema: JournalEntryCreate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = JournalService(db)
    item = await service.create_entry(current_user.id, schema)
    await db.commit()
    await db.refresh(item)
    return BaseResponse(data=item, message="Journal entry recorded successfully")

@router.put("/{id}", response_model=BaseResponse[JournalEntryResponse])
async def update_journal_entry(
    id: uuid.UUID,
    schema: JournalEntryUpdate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = JournalService(db)
    item = await service.update_entry(current_user.id, id, schema)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found or access denied."
        )
    await db.commit()
    await db.refresh(item)
    return BaseResponse(data=item, message="Journal entry updated successfully")

@router.delete("/{id}", response_model=BaseResponse[dict])
async def delete_journal_entry(
    id: uuid.UUID,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = JournalService(db)
    success = await service.delete_entry(current_user.id, id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found or access denied."
        )
    await db.commit()
    return BaseResponse(data={}, message="Journal entry deleted successfully")

@router.get("/stats", response_model=BaseResponse[JournalStatsResponse])
async def get_journal_stats(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = JournalService(db)
    stats = await service.get_stats(current_user.id)
    return BaseResponse(data=stats)

@router.get("/stats/monthly", response_model=BaseResponse[List[MonthlyStatsResponse]])
async def get_monthly_journal_stats(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = JournalService(db)
    stats = await service.get_monthly_stats(current_user.id)
    return BaseResponse(data=stats)

@router.get("/stats/pairs", response_model=BaseResponse[List[PairStatsResponse]])
async def get_pair_journal_stats(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = JournalService(db)
    stats = await service.get_pair_stats(current_user.id)
    return BaseResponse(data=stats)
