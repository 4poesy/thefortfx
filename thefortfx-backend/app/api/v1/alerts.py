from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user
from app.models.user import Profile
from app.schemas.alert import AlertResponse, AlertCreate, AlertUpdate, AlertDeliveryResponse
from app.schemas.common import BaseResponse
from app.services.alert_service import AlertService

router = APIRouter()

@router.get("", response_model=BaseResponse[List[AlertResponse]])
async def get_alerts(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AlertService(db)
    items = await service.get_user_alerts(current_user.id)
    return BaseResponse(data=items)

@router.post("", response_model=BaseResponse[AlertResponse], status_code=status.HTTP_201_CREATED)
async def create_alert(
    schema: AlertCreate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AlertService(db)
    item = await service.create_alert(current_user.id, schema)
    await db.commit()
    return BaseResponse(data=item, message="Alert configured successfully")

@router.put("/{id}", response_model=BaseResponse[AlertResponse])
async def update_alert(
    id: uuid.UUID,
    schema: AlertUpdate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AlertService(db)
    item = await service.update_alert(current_user.id, id, schema)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found or access denied."
        )
    await db.commit()
    return BaseResponse(data=item, message="Alert updated successfully")

@router.delete("/{id}", response_model=BaseResponse[dict])
async def delete_alert(
    id: uuid.UUID,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AlertService(db)
    success = await service.delete_alert(current_user.id, id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found or access denied."
        )
    await db.commit()
    return BaseResponse(data={}, message="Alert deleted successfully")

@router.get("/{id}/delivery-history", response_model=BaseResponse[List[AlertDeliveryResponse]])
async def get_delivery_history(
    id: uuid.UUID,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AlertService(db)
    items = await service.get_delivery_history(current_user.id, id)
    return BaseResponse(data=items)
