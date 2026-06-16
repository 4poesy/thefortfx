from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class PlanResponse(BaseModel):
    """API contract returning subscription plan details."""
    name: str
    slug: str
    price_monthly: float
    price_yearly: float
    features: List[str]
    is_popular: bool

class SubscriptionResponse(BaseModel):
    """API contract returning active user subscription properties."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    plan: str
    status: str
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    cancel_at_period_end: bool
    created_at: datetime

class CheckoutRequest(BaseModel):
    """API contract for creating a Stripe checkout session."""
    plan: str  # 'premium' or 'agency'
    billing_cycle: str = "monthly"  # 'monthly' or 'yearly'

class CheckoutResponse(BaseModel):
    """API contract returning redirect details for Stripe checkout."""
    checkout_url: str
    session_id: str

class PortalResponse(BaseModel):
    """API contract returning redirect details for the Stripe customer portal."""
    portal_url: str
