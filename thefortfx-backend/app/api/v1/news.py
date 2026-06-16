from typing import Optional, List
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.dependencies import get_db, PaginationParams
from app.models.news import News
from app.schemas.news import NewsResponse
from app.schemas.common import BaseResponse, PaginatedResponse

router = APIRouter()

@router.get("", response_model=PaginatedResponse[NewsResponse])
async def get_news(
    pair_slug: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
    params: PaginationParams = Depends(),
    db: AsyncSession = Depends(get_db)
):
    skip = (params.page - 1) * params.limit
    query = select(News)
    
    if pair_slug:
        # Check if pair_slug is contained in affected_pairs array column
        query = query.where(News.affected_pairs.any(pair_slug.upper()))
        
    if tag:
        query = query.where(News.tags.any(tag))
        
    count_query = select(func.count()).select_from(query.subquery())
    count_res = await db.execute(count_query)
    total = count_res.scalar_one()
    
    query = query.order_by(News.published_at.desc()).offset(skip).limit(params.limit)
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

@router.get("/{slug_or_id}", response_model=BaseResponse[NewsResponse])
async def get_news_article(
    slug_or_id: str,
    db: AsyncSession = Depends(get_db)
):
    try:
        uuid_val = uuid.UUID(slug_or_id)
        query = select(News).where(News.id == uuid_val)
    except ValueError:
        query = select(News).where(News.slug == slug_or_id.lower())
        
    res = await db.execute(query)
    article = res.scalar_one_or_none()
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="News article not found")
    return BaseResponse(data=article)
