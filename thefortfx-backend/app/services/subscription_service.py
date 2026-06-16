from __future__ import annotations
import uuid
import stripe
from datetime import datetime
from typing import Optional, List
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.subscription import Subscription
from app.models.user import Profile
from app.repositories.base import BaseRepository
from app.core.logging import get_logger

logger = get_logger("app.services.subscription")
settings = get_settings()

if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY

class SubscriptionService:
    """Service layer managing subscription configurations, Stripe checkouts, portals, and webhooks."""
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = BaseRepository(Subscription, db)

    async def get_plans(self) -> List[dict]:
        """Returns the list of available pricing plans (Free, Pro, Agency)."""
        return [
            {
                "name": "Free",
                "slug": "free",
                "price_monthly": 0.0,
                "price_yearly": 0.0,
                "features": ["3 active signals", "Daily forecasts", "Calculators"],
                "is_popular": False
            },
            {
                "name": "Pro",
                "slug": "premium",
                "price_monthly": 29.0,
                "price_yearly": 290.0,
                "features": ["Unlimited active signals", "AI trade analysis (Gemini)", "Telegram alerts", "Custom webhooks"],
                "is_popular": True
            },
            {
                "name": "Agency",
                "slug": "agency",
                "price_monthly": 79.0,
                "price_yearly": 790.0,
                "features": ["Everything in Pro", "AI trade analysis (Claude)", "Unlimited alerts", "Dedicated webhook delivery", "Priority support"],
                "is_popular": False
            }
        ]

    async def get_user_subscription(self, user_id: uuid.UUID) -> Subscription:
        """Gets the user's active subscription record, initializing a Free subscription if not present."""
        query = select(Subscription).where(Subscription.user_id == user_id)
        result = await self.db.execute(query)
        sub = result.scalar_one_or_none()
        
        if not sub:
            sub = Subscription(
                user_id=user_id,
                plan="free",
                status="active"
            )
            self.db.add(sub)
            await self.db.flush()
            
        return sub

    async def create_checkout_session(self, user_id: uuid.UUID, plan: str, billing_cycle: str = "monthly") -> dict:
        """Creates a Stripe Checkout Session for subscribing to a plan."""
        if plan not in ["premium", "agency"]:
            raise ValueError("Only 'premium' or 'agency' plans require Stripe checkout.")
            
        price_id = settings.STRIPE_PRICE_ID_PRO if plan == "premium" else settings.STRIPE_PRICE_ID_AGENCY
        if not price_id:
            price_id = f"price_mock_{plan}_{billing_cycle}"
            
        profile_query = select(Profile).where(Profile.id == user_id)
        profile_res = await self.db.execute(profile_query)
        profile = profile_res.scalar_one()
        
        sub = await self.get_user_subscription(user_id)
        customer_id = sub.stripe_customer_id
        
        # 1. Create customer if not exists
        if not customer_id and settings.STRIPE_SECRET_KEY:
            customer = stripe.Customer.create(
                email=profile.email,
                metadata={"user_id": str(user_id)}
            )
            customer_id = customer.id
            sub.stripe_customer_id = customer_id
            self.db.add(sub)
            await self.db.flush()
            
        if not settings.STRIPE_SECRET_KEY:
            # Mock mode checkout
            return {
                "checkout_url": f"{settings.APP_URL}/dashboard?checkout_session=mock_session_id",
                "session_id": "mock_session_id"
            }
            
        # 2. Create Stripe Session
        session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="subscription",
            success_url=f"{settings.APP_URL}/dashboard?subscription_success=true&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.APP_URL}/billing?subscription_cancelled=true",
            metadata={"user_id": str(user_id), "plan": plan}
        )
        
        return {
            "checkout_url": session.url,
            "session_id": session.id
        }

    async def create_portal_session(self, user_id: uuid.UUID) -> dict:
        """Creates a Stripe billing portal session url for managing subscriptions."""
        sub = await self.get_user_subscription(user_id)
        customer_id = sub.stripe_customer_id
        
        if not customer_id:
            raise ValueError("No Stripe customer profile exists. Please subscribe to a plan first.")
            
        if not settings.STRIPE_SECRET_KEY:
            return {"portal_url": f"{settings.APP_URL}/dashboard"}
            
        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=f"{settings.APP_URL}/dashboard"
        )
        return {"portal_url": session.url}

    async def cancel_subscription(self, user_id: uuid.UUID) -> bool:
        """Flags the subscription to cancel at the end of the current billing cycle."""
        sub = await self.get_user_subscription(user_id)
        if not sub.stripe_subscription_id:
            return False
            
        if settings.STRIPE_SECRET_KEY:
            stripe.Subscription.modify(
                sub.stripe_subscription_id,
                cancel_at_period_end=True
            )
            
        sub.cancel_at_period_end = True
        self.db.add(sub)
        await self.db.flush()
        return True

    async def handle_webhook(self, payload: bytes, signature: str) -> bool:
        """Processes Stripe webhook events to sync database subscriptions and profiles."""
        if not settings.STRIPE_SECRET_KEY:
            return False
            
        try:
            event = stripe.Webhook.construct_event(
                payload, signature, settings.STRIPE_WEBHOOK_SECRET
            )
        except Exception as e:
            logger.error(f"Stripe webhook signature validation failed: {e}")
            return False
            
        event_type = event["type"]
        data_object = event["data"]["object"]
        
        logger.info(f"Received Stripe webhook event: {event_type}")
        
        if event_type == "checkout.session.completed":
            user_id_str = data_object.get("metadata", {}).get("user_id")
            plan = data_object.get("metadata", {}).get("plan", "premium")
            sub_id = data_object.get("subscription")
            cust_id = data_object.get("customer")
            
            if user_id_str:
                user_id = uuid.UUID(user_id_str)
                await self._update_user_plan(user_id, plan, sub_id, cust_id, "active")
                
        elif event_type in ["customer.subscription.updated", "customer.subscription.deleted"]:
            sub_id = data_object.get("id")
            status = data_object.get("status")
            cust_id = data_object.get("customer")
            
            query = select(Subscription).where(Subscription.stripe_subscription_id == sub_id)
            result = await self.db.execute(query)
            db_sub = result.scalar_one_or_none()
            
            if db_sub:
                if status == "canceled" or event_type == "customer.subscription.deleted":
                    await self._update_user_plan(db_sub.user_id, "free", None, cust_id, "active")
                else:
                    plan = db_sub.plan
                    if settings.STRIPE_SECRET_KEY:
                        stripe_sub = stripe.Subscription.retrieve(sub_id)
                        price_id = stripe_sub["items"]["data"][0]["price"]["id"]
                        if price_id == settings.STRIPE_PRICE_ID_AGENCY:
                            plan = "agency"
                        elif price_id == settings.STRIPE_PRICE_ID_PRO:
                            plan = "premium"
                            
                    await self._update_user_plan(db_sub.user_id, plan, sub_id, cust_id, status)
                    
        return True

    async def _update_user_plan(
        self,
        user_id: uuid.UUID,
        plan: str,
        subscription_id: Optional[str],
        customer_id: Optional[str],
        status: str
    ) -> None:
        """Utility helper syncing profile role and subscription plan fields."""
        query = select(Subscription).where(Subscription.user_id == user_id)
        result = await self.db.execute(query)
        sub = result.scalar_one_or_none()
        
        if not sub:
            sub = Subscription(user_id=user_id)
            
        sub.plan = plan
        sub.status = status
        if subscription_id:
            sub.stripe_subscription_id = subscription_id
        if customer_id:
            sub.stripe_customer_id = customer_id
            
        if plan == "free":
            sub.stripe_subscription_id = None
            sub.current_period_start = None
            sub.current_period_end = None
            sub.cancel_at_period_end = False
            
        self.db.add(sub)
        
        # Sync User role
        profile_query = update(Profile).where(Profile.id == user_id).values(role=plan)
        await self.db.execute(profile_query)
        
        await self.db.flush()
