from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request, Header, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user
from app.models.user import Profile
from app.schemas.subscription import PlanResponse, CheckoutRequest, CheckoutResponse, PortalResponse
from app.schemas.common import BaseResponse
from app.services.subscription_service import SubscriptionService

router = APIRouter()

@router.get("/plans", response_model=BaseResponse[List[PlanResponse]])
async def get_plans(db: AsyncSession = Depends(get_db)):
    service = SubscriptionService(db)
    plans = await service.get_plans()
    return BaseResponse(data=plans)

@router.post("/checkout", response_model=BaseResponse[CheckoutResponse])
async def create_checkout(
    request: CheckoutRequest,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = SubscriptionService(db)
    try:
        session_data = await service.create_checkout_session(
            user_id=current_user.id,
            plan=request.plan,
            billing_cycle=request.billing_cycle
        )
        return BaseResponse(data=session_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/portal", response_model=BaseResponse[PortalResponse])
async def create_portal(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = SubscriptionService(db)
    try:
        portal_data = await service.create_portal_session(user_id=current_user.id)
        return BaseResponse(data=portal_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/cancel", response_model=BaseResponse[dict])
async def cancel_subscription(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = SubscriptionService(db)
    success = await service.cancel_subscription(current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to cancel subscription or no active paid subscription exists."
        )
    await db.commit()
    return BaseResponse(data={}, message="Subscription cancellation scheduled at current period end.")

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not stripe_signature:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stripe signature header is missing"
        )
        
    payload = await request.body()
    service = SubscriptionService(db)
    
    success = await service.handle_webhook(payload, stripe_signature)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Stripe webhook processing failed"
        )
        
    await db.commit()
    return {"status": "success"}
