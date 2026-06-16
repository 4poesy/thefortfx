from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.core.security import require_role
from app.models.user import Profile
from app.schemas.sentiment import SentimentResponse, SentimentCreate
from app.schemas.common import BaseResponse
from app.services.sentiment_service import SentimentService

router = APIRouter()

@router.get("", response_model=BaseResponse[List[SentimentResponse]])
async def get_sentiment(
    category: Optional[str] = Query(None, description="Filter by asset category"),
    db: AsyncSession = Depends(get_db)
):
    sent_service = SentimentService(db)
    items = await sent_service.get_all_sentiment(category)
    return BaseResponse(data=items)

@router.get("/{slug}", response_model=BaseResponse[SentimentResponse])
async def get_sentiment_detail(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    sent_service = SentimentService(db)
    item = await sent_service.get_sentiment_by_slug(slug)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sentiment data for pair slug '{slug}' not found."
        )
    return BaseResponse(data=item)

@router.post("", response_model=BaseResponse[SentimentResponse], status_code=status.HTTP_201_CREATED)
async def create_sentiment(
    schema: SentimentCreate,
    admin: Profile = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db)
):
    sent_service = SentimentService(db)
    item = await sent_service.create_or_update(schema)
    await db.commit()
    return BaseResponse(data=item, message="Sentiment logged successfully")
