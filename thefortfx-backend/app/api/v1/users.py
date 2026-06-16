from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.dependencies import get_db, get_current_user
from app.models.user import Profile
from app.models.alert import Alert
from app.models.watchlist import Watchlist
from app.schemas.user import ProfileResponse, ProfileUpdate, UserStatsResponse
from app.schemas.subscription import SubscriptionResponse
from app.schemas.common import BaseResponse
from app.services.journal_service import JournalService
from app.services.subscription_service import SubscriptionService
from app.repositories.user import UserRepository

router = APIRouter()

@router.get("/me", response_model=BaseResponse[ProfileResponse])
async def get_me(current_user: Profile = Depends(get_current_user)):
    return BaseResponse(data=current_user)

@router.patch("/me", response_model=BaseResponse[ProfileResponse])
async def update_me(
    schema: ProfileUpdate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_repo = UserRepository(db)
    update_data = schema.model_dump(exclude_unset=True)
    
    updated = await user_repo.update(current_user.id, update_data)
    await db.commit()
    await db.refresh(updated)
    return BaseResponse(data=updated, message="Profile updated successfully")

@router.delete("/me", response_model=BaseResponse[dict])
async def delete_me(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    current_user.is_active = False
    await db.commit()
    return BaseResponse(data={}, message="Account deactivated successfully")

@router.get("/me/stats", response_model=BaseResponse[UserStatsResponse])
async def get_user_stats(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    journal_service = JournalService(db)
    trade_stats = await journal_service.get_stats(current_user.id)
    
    alerts_query = select(func.count(Alert.id)).where(Alert.user_id == current_user.id, Alert.is_active == True)
    alerts_res = await db.execute(alerts_query)
    active_alerts = alerts_res.scalar() or 0
    
    watchlist_query = select(func.count(Watchlist.id)).where(Watchlist.user_id == current_user.id)
    watchlist_res = await db.execute(watchlist_query)
    watchlist_count = watchlist_res.scalar() or 0
    
    stats = UserStatsResponse(
        total_trades=trade_stats.total_trades,
        wins=trade_stats.wins,
        losses=trade_stats.losses,
        win_rate=trade_stats.win_rate,
        total_pnl=trade_stats.total_pnl,
        avg_r_multiple=trade_stats.avg_r_multiple,
        best_trade=trade_stats.best_trade,
        worst_trade=trade_stats.worst_trade,
        active_alerts=active_alerts,
        watchlist_count=watchlist_count
    )
    
    return BaseResponse(data=stats)

@router.get("/me/subscription", response_model=BaseResponse[SubscriptionResponse])
async def get_subscription(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    sub_service = SubscriptionService(db)
    sub = await sub_service.get_user_subscription(current_user.id)
    return BaseResponse(data=sub)
