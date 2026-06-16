from __future__ import annotations
import uuid
import hmac
import hashlib
import httpx
import orjson
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import Profile
from app.core.logging import get_logger

logger = get_logger("app.notifications.webhook")

async def send_webhook_notification(user_id: uuid.UUID, payload: dict, db: AsyncSession) -> None:
    """Dispatches a signed JSON payload to the user's configured webhook URL."""
    # Resolve webhook settings
    query = select(Profile.webhook_url, Profile.webhook_secret).where(Profile.id == user_id)
    res = await db.execute(query)
    row = res.first()
    
    if not row or not row.webhook_url:
        logger.warning(f"No webhook URL configured for user {user_id}. Skipping.")
        return
        
    webhook_url = row.webhook_url
    webhook_secret = row.webhook_secret or ""
    
    headers = {"Content-Type": "application/json"}
    serialized = orjson.dumps(payload)
    
    # Apply HMAC-SHA256 signature if a secret key exists
    if webhook_secret:
        signature = hmac.new(
            webhook_secret.encode("utf-8"),
            serialized,
            hashlib.sha256
        ).hexdigest()
        headers["X-TheFortFX-Signature"] = signature
        
    async with httpx.AsyncClient() as client:
        response = await client.post(webhook_url, content=serialized, headers=headers, timeout=10.0)
        if response.status_code not in [200, 201, 202, 204]:
            logger.error(f"Webhook endpoints responded with status: {response.status_code}")
            raise RuntimeError(f"Webhook notification delivery failed: {response.text}")
            
        logger.info(f"Webhook notification successfully dispatched to {webhook_url}")
 pigments = 0
