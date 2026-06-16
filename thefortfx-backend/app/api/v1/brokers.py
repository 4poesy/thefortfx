from typing import Optional, List
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.dependencies import get_db
from app.models.broker import Broker
from app.schemas.broker import BrokerResponse, BrokerCompareResponse
from app.schemas.common import BaseResponse

router = APIRouter()

@router.get("", response_model=BaseResponse[List[BrokerResponse]])
async def get_brokers(
    platform: Optional[str] = Query(None, description="Filter brokers by trading platform (e.g. MT4, MT5)"),
    regulation: Optional[str] = Query(None, description="Filter brokers by regulatory body (e.g. FCA, ASIC)"),
    min_deposit: Optional[int] = Query(None, description="Filter by maximum minimum deposit limit"),
    db: AsyncSession = Depends(get_db)
):
    query = select(Broker)
    res = await db.execute(query)
    brokers = list(res.scalars().all())
    
    filtered = []
    for broker in brokers:
        if platform and platform.upper() not in [p.upper() for p in broker.platforms]:
            continue
        if regulation and regulation.upper() not in [r.upper() for r in broker.regulation]:
            continue
        if min_deposit is not None and broker.min_deposit > min_deposit:
            continue
        filtered.append(broker)
        
    filtered.sort(key=lambda b: (b.display_order, -b.overall_score))
    return BaseResponse(data=filtered)

@router.get("/compare", response_model=BaseResponse[BrokerCompareResponse])
async def compare_brokers(
    slug_a: str = Query(..., description="Slug of the first broker"),
    slug_b: str = Query(..., description="Slug of the second broker"),
    db: AsyncSession = Depends(get_db)
):
    query_a = select(Broker).where(Broker.slug == slug_a.lower())
    query_b = select(Broker).where(Broker.slug == slug_b.lower())
    
    res_a = await db.execute(query_a)
    broker_a = res_a.scalar_one_or_none()
    
    res_b = await db.execute(query_b)
    broker_b = res_b.scalar_one_or_none()
    
    if not broker_a:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Broker A '{slug_a}' not found")
    if not broker_b:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Broker B '{slug_b}' not found")
        
    compare_res = BrokerCompareResponse(broker_a=broker_a, broker_b=broker_b)
    return BaseResponse(data=compare_res)

@router.get("/{slug}", response_model=BaseResponse[BrokerResponse])
async def get_broker(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    query = select(Broker).where(Broker.slug == slug.lower())
    res = await db.execute(query)
    broker = res.scalar_one_or_none()
    if not broker:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Broker '{slug}' not found")
    return BaseResponse(data=broker)
