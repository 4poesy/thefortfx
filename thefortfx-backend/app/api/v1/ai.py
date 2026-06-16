from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, get_current_user
from app.models.user import Profile
from app.schemas.ai import AITradeAnalysisRequest, AITradeAnalysisResponse
from app.schemas.common import BaseResponse
from app.services.ai_service import AIService

router = APIRouter()

@router.post("/analyze-trade", response_model=BaseResponse[AITradeAnalysisResponse])
async def analyze_trade(
    request: AITradeAnalysisRequest,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AIService(db)
    res = await service.analyze_trade(request, current_user.role)
    return BaseResponse(data=res)

@router.get("/market-summary", response_model=BaseResponse[str])
async def get_market_summary(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AIService(db)
    summary = await service.get_market_summary()
    return BaseResponse(data=summary)

@router.get("/pair-analysis/{slug}", response_model=BaseResponse[str])
async def get_pair_analysis(
    slug: str,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AIService(db)
    analysis = await service.get_pair_analysis(slug)
    return BaseResponse(data=analysis)
