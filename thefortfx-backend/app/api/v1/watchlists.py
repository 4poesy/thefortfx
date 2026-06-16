from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.dependencies import get_db, get_current_user
from app.models.user import Profile
from app.models.watchlist import Watchlist
from app.repositories.watchlist import WatchlistRepository
from app.repositories.pair import PairRepository
from app.schemas.watchlist import WatchlistResponse, WatchlistCreate
from app.schemas.common import BaseResponse

router = APIRouter()

@router.get("", response_model=BaseResponse[List[WatchlistResponse]])
async def get_watchlist(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    wl_repo = WatchlistRepository(db)
    items = await wl_repo.get_user_watchlist(current_user.id)
    
    # Dynamically inject latest signal on each item
    for item in items:
        latest_signal = None
        if item.pair and item.pair.signals:
            active_sigs = [s for s in item.pair.signals if s.status == "active"]
            if active_sigs:
                active_sigs.sort(key=lambda s: s.created_at, reverse=True)
                latest_signal = active_sigs[0]
        item.latest_signal = latest_signal
        
    return BaseResponse(data=items)

@router.post("", response_model=BaseResponse[WatchlistResponse], status_code=status.HTTP_201_CREATED)
async def add_to_watchlist(
    schema: WatchlistCreate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    pair_repo = PairRepository(db)
    wl_repo = WatchlistRepository(db)
    
    pair = await pair_repo.get_by_slug(schema.pair_slug)
    if not pair:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pair with slug '{schema.pair_slug}' not found."
        )
        
    already_watching = await wl_repo.is_watching(current_user.id, pair.id)
    if already_watching:
        query = select(Watchlist).where(Watchlist.user_id == current_user.id, Watchlist.pair_id == pair.id).options(selectinload(Watchlist.pair))
        res = await db.execute(query)
        item = res.scalar_one()
        item.latest_signal = None
        return BaseResponse(data=item, message="Pair is already in your watchlist")
        
    item = await wl_repo.add_pair(current_user.id, pair.id)
    await db.commit()
    
    # Reload with relation
    query = select(Watchlist).where(Watchlist.id == item.id).options(selectinload(Watchlist.pair))
    res = await db.execute(query)
    reloaded_item = res.scalar_one()
    reloaded_item.latest_signal = None
    
    return BaseResponse(data=reloaded_item, message="Pair added to watchlist")

@router.delete("/{slug}", response_model=BaseResponse[dict])
async def remove_from_watchlist(
    slug: str,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    wl_repo = WatchlistRepository(db)
    removed = await wl_repo.remove_pair(current_user.id, slug)
    if not removed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pair '{slug}' not found on your watchlist."
        )
    await db.commit()
    return BaseResponse(data={}, message="Pair removed from watchlist")
