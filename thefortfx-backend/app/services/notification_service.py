from __future__ import annotations
import uuid
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.alert import AlertDelivery
from app.core.logging import get_logger

logger = get_logger("app.services.notification")

class NotificationService:
    """Service layer routing alerts to various notification channels and logging delivery state."""
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def send(
        self,
        user_id: uuid.UUID,
        alert_id: uuid.UUID,
        channels: List[str],
        payload: Dict[str, Any]
    ) -> None:
        """Iterates over the target channels, dispatches notifications, and logs history records."""
        for channel in channels:
            status = "sent"
            clean_channel = channel.strip().lower()
            
            try:
                if clean_channel == "telegram":
                    from app.notifications.telegram import send_telegram_notification
                    await send_telegram_notification(user_id, payload, self.db)
                elif clean_channel == "email":
                    from app.notifications.email import send_email_notification
                    await send_email_notification(user_id, payload, self.db)
                elif clean_channel == "webhook":
                    from app.notifications.webhook import send_webhook_notification
                    await send_webhook_notification(user_id, payload, self.db)
                else:
                    logger.warning(f"Unsupported notification channel: {channel}")
                    status = "failed"
            except Exception as e:
                logger.error(f"Failed to send notification via {channel} for user {user_id}: {e}")
                status = "failed"
                
            # Log the delivery attempt in the database
            delivery = AlertDelivery(
                alert_id=alert_id,
                user_id=user_id,
                channel=clean_channel,
                payload=payload,
                status=status
            )
            self.db.add(delivery)
            
        await self.db.flush()
