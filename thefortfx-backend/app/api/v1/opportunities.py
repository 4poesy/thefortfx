from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.repositories.opportunity import OpportunityRepository
from app.schemas.opportunity import OpportunityResponse
from app.schemas.common import BaseResponse

router = APIRouter()

@router.get("", response_model=BaseResponse[List[OpportunityResponse]])
async def get_opportunities(
    direction: Optional[str] = Query(None),
    news_risk: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    opp_repo = OpportunityRepository(db)
    items = await opp_repo.get_ranked(
        direction=direction,
        news_risk=news_risk,
        category=category,
        limit=limit
    )
    return BaseResponse(data=items)

@router.get("/top", response_model=BaseResponse[List[OpportunityResponse]])
async def get_top_opportunities(
    limit: int = Query(10, ge=1, le=20),
    db: AsyncSession = Depends(get_db)
):
    opp_repo = OpportunityRepository(db)
    items = await opp_repo.get_top(limit=limit)
    return BaseResponse(data=items)

@router.get("/{slug}", response_model=BaseResponse[OpportunityResponse])
async def get_opportunity_detail(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    opp_repo = OpportunityRepository(db)
    item = await opp_repo.get_by_pair_slug(slug)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Opportunity details for pair slug '{slug}' not found or has expired."
        )
    return BaseResponse(data=item)
