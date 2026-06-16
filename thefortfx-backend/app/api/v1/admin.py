from typing import Optional, List
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

from app.dependencies import get_db, PaginationParams
from app.core.security import require_role
from app.models.user import Profile
from app.models.audit_log import AuditLog
from app.models.signal import Signal
from app.schemas.user import ProfileResponse
from app.schemas.signal import SignalCreate, SignalResponse
from app.schemas.common import BaseResponse, PaginatedResponse
from app.services.analytics_service import AnalyticsService
from app.services.signal_service import SignalService
from app.repositories.user import UserRepository

router = APIRouter()

class BroadcastRequest(BaseModel):
    message: str
    channels: List[str] = ["email"]

class RoleUpdateRequest(BaseModel):
    role: str

@router.get("/analytics", response_model=BaseResponse[dict])
async def get_admin_analytics(
    admin: Profile = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    analytics = AnalyticsService(db)
    platform = await analytics.get_platform_analytics()
    return BaseResponse(data=platform)

@router.get("/analytics/revenue", response_model=BaseResponse[dict])
async def get_admin_revenue_analytics(
    admin: Profile = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    analytics = AnalyticsService(db)
    revenue = await analytics.get_revenue_metrics()
    return BaseResponse(data=revenue)

@router.get("/users", response_model=PaginatedResponse[ProfileResponse])
async def get_users_list(
    role: Optional[str] = Query(None),
    params: PaginationParams = Depends(),
    admin: Profile = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    user_repo = UserRepository(db)
    skip = (params.page - 1) * params.limit
    items, total = await user_repo.get_all_users(skip=skip, limit=params.limit, role_filter=role)
    
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

@router.patch("/users/{id}/role", response_model=BaseResponse[ProfileResponse])
async def change_user_role(
    id: uuid.UUID,
    schema: RoleUpdateRequest,
    admin: Profile = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    if schema.role not in ["free", "premium", "agency", "admin"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role specified")
    user_repo = UserRepository(db)
    user = await user_repo.get(id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")
    user.role = schema.role
    await db.commit()
    await db.refresh(user)
    return BaseResponse(data=user, message="User role updated successfully")

@router.delete("/users/{id}", response_model=BaseResponse[dict])
async def deactivate_user(
    id: uuid.UUID,
    admin: Profile = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    user_repo = UserRepository(db)
    user = await user_repo.get(id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")
    user.is_active = False
    await db.commit()
    return BaseResponse(data={}, message="User deactivated successfully")

@router.get("/signals", response_model=PaginatedResponse[SignalResponse])
async def get_all_signals_admin(
    params: PaginationParams = Depends(),
    admin: Profile = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    skip = (params.page - 1) * params.limit
    query = select(Signal).options(selectinload(Signal.pair))
    
    count_query = select(func.count()).select_from(query.subquery())
    count_res = await db.execute(count_query)
    total = count_res.scalar_one()
    
    query = query.order_by(Signal.created_at.desc()).offset(skip).limit(params.limit)
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

@router.post("/signals/bulk", response_model=BaseResponse[List[SignalResponse]])
async def bulk_create_signals(
    signals_list: List[SignalCreate],
    admin: Profile = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    sig_service = SignalService(db)
    created_signals = []
    
    for schema in signals_list:
        signal = await sig_service.create_signal(schema, creator_id=admin.id)
        created_signals.append(signal)
        
    await db.commit()
    
    ids = [s.id for s in created_signals]
    query = select(Signal).where(Signal.id.in_(ids)).options(selectinload(Signal.pair))
    res = await db.execute(query)
    items = list(res.scalars().all())
    
    return BaseResponse(data=items, message=f"Successfully bulk created {len(items)} signals.")

@router.get("/audit-logs", response_model=PaginatedResponse[dict])
async def get_audit_logs(
    params: PaginationParams = Depends(),
    admin: Profile = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    skip = (params.page - 1) * params.limit
    query = select(AuditLog)
    
    count_query = select(func.count()).select_from(query.subquery())
    count_res = await db.execute(count_query)
    total = count_res.scalar_one()
    
    query = query.order_by(AuditLog.created_at.desc()).offset(skip).limit(params.limit)
    res = await db.execute(query)
    items = list(res.scalars().all())
    
    serialized = []
    for item in items:
        serialized.append({
            "id": str(item.id),
            "user_id": str(item.user_id) if item.user_id else None,
            "action": item.action,
            "resource": item.resource,
            "resource_id": item.resource_id,
            "ip_address": item.ip_address,
            "user_agent": item.user_agent,
            "metadata": item.meta,
            "created_at": item.created_at.isoformat()
        })
        
    total_pages = (total + params.limit - 1) // params.limit
    return PaginatedResponse(
        data=serialized,
        total=total,
        page=params.page,
        limit=params.limit,
        total_pages=total_pages,
        has_next=params.page < total_pages,
        has_prev=params.page > 1
    )

@router.post("/broadcast", response_model=BaseResponse[dict])
async def broadcast_announcement(
    request: BroadcastRequest,
    admin: Profile = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    query = select(Profile).where(Profile.is_active == True)
    res = await db.execute(query)
    users = list(res.scalars().all())
    
    sent_count = 0
    payload = {
        "title": "Platform Announcement",
        "message": request.message,
        "type": "broadcast"
    }
    
    for user in users:
        for channel in request.channels:
            clean_channel = channel.strip().lower()
            try:
                if clean_channel == "email":
                    from app.notifications.email import send_email_notification
                    await send_email_notification(user.id, payload, db)
                elif clean_channel == "telegram":
                    from app.notifications.telegram import send_telegram_notification
                    await send_telegram_notification(user.id, payload, db)
                elif clean_channel == "webhook":
                    from app.notifications.webhook import send_webhook_notification
                    await send_webhook_notification(user.id, payload, db)
                sent_count += 1
            except Exception:
                pass
                
    return BaseResponse(data={"delivered_count": sent_count}, message="Broadcast completed")
