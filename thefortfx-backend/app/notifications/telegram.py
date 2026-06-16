from __future__ import annotations
import uuid
import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.user import Profile
from app.core.logging import get_logger

logger = get_logger("app.notifications.telegram")
settings = get_settings()

async def send_telegram_notification(user_id: uuid.UUID, payload: dict, db: AsyncSession) -> None:
    """Dispatches a formatted Markdown message to the user's Telegram chat, falling back to general channel."""
    token = settings.TELEGRAM_BOT_TOKEN
    if not token:
        logger.warning("Telegram Bot Token is not configured. Skipping notification.")
        return
        
    # Fetch Telegram Chat ID for user
    query = select(Profile.telegram_chat_id).where(Profile.id == user_id)
    res = await db.execute(query)
    chat_id = res.scalar_one_or_none()
    
    # Fallback to general broadcast channel if user hasn't set theirs up
    if not chat_id:
        chat_id = settings.TELEGRAM_CHANNEL_ID
        
    if not chat_id:
        logger.warning(f"No Telegram chat ID found for user {user_id} and no channel ID configured. Skipping.")
        return
        
    # Construct a readable message payload
    alert_type = payload.get("alert_type", "alert")
    pair = payload.get("pair", "Unknown Pair")
    
    if alert_type == "signal":
        direction = payload.get("direction", "NEUTRAL")
        emoji = "🟢 BUY" if direction == "BUY" else "🔴 SELL" if direction == "SELL" else "⚪ NEUTRAL"
        
        text = (
            f"⚡ *TheFortFX Signal Alert* ⚡\n\n"
            f"Asset: *{pair}*\n"
            f"Direction: *{emoji}*\n"
            f"Entry: `{payload.get('entry')}`\n"
            f"Stop Loss: `{payload.get('stop')}`\n"
            f"Take Profit: `{payload.get('target')}`\n"
            f"Confidence: *{payload.get('confidence')}%*\n"
            f"Setup: _{payload.get('setup')}_"
        )
    else:
        text = (
            f"🔔 *TheFortFX Alert Triggered*\n\n"
            f"Asset: *{pair}*\n"
            f"Alert Type: *{alert_type.capitalize()}*\n"
            f"Details: {payload.get('message', 'Alert criteria met.')}"
        )

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    params = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=params, timeout=10.0)
        if response.status_code != 200:
            logger.error(f"Telegram bot API error response: {response.text}")
            raise RuntimeError(f"Telegram notification delivery failed: {response.text}")
            
        logger.info(f"Telegram notification successfully dispatched to {chat_id}")
