from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional, List, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.repositories.base import BaseRepository
from app.models.alert import Alert, AlertDelivery
from app.schemas.alert import AlertCreate, AlertUpdate
from app.core.logging import get_logger

logger = get_logger("app.services.alert")

class AlertService:
    """Service layer managing user alert preferences and matching incoming market events."""
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = BaseRepository(Alert, db)
        self.delivery_repo = BaseRepository(AlertDelivery, db)

    async def get_user_alerts(self, user_id: uuid.UUID) -> List[Alert]:
        """Gets all alerts configured by a user, loaded with the asset Pair relation."""
        query = (
            select(Alert)
            .where(Alert.user_id == user_id)
            .options(selectinload(Alert.pair))
            .order_by(Alert.created_at.desc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create_alert(self, user_id: uuid.UUID, schema: AlertCreate) -> Alert:
        """Configures a new alert for a user."""
        alert_data = schema.model_dump()
        alert_data["user_id"] = user_id
        alert = await self.repo.create(alert_data)
        
        # Load relations for the response model
        query = select(Alert).where(Alert.id == alert.id).options(selectinload(Alert.pair))
        res = await self.db.execute(query)
        return res.scalar_one()

    async def update_alert(self, user_id: uuid.UUID, alert_id: uuid.UUID, schema: AlertUpdate) -> Optional[Alert]:
        """Updates alert settings, verifying user ownership first."""
        alert = await self.repo.get(alert_id)
        if not alert or alert.user_id != user_id:
            return None
            
        update_data = schema.model_dump(exclude_unset=True)
        updated = await self.repo.update(alert_id, update_data)
        return updated

    async def delete_alert(self, user_id: uuid.UUID, alert_id: uuid.UUID) -> bool:
        """Deletes an alert configuration, verifying user ownership first."""
        alert = await self.repo.get(alert_id)
        if not alert or alert.user_id != user_id:
            return False
            
        return await self.repo.delete(alert_id)

    async def get_delivery_history(self, user_id: uuid.UUID, alert_id: uuid.UUID) -> List[AlertDelivery]:
        """Fetches the log of previous notifications sent for a specific alert, verifying ownership."""
        alert = await self.repo.get(alert_id)
        if not alert or alert.user_id != user_id:
            return []
            
        query = (
            select(AlertDelivery)
            .where(AlertDelivery.alert_id == alert_id)
            .order_by(AlertDelivery.delivered_at.desc())
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def check_and_trigger_signals(self, signal: Any) -> int:
        """Evaluates a new signal against all active user alerts and dispatches matching alerts."""
        query = (
            select(Alert)
            .where(
                Alert.pair_id == signal.pair_id,
                Alert.alert_type == "signal",
                Alert.is_active == True
            )
            .options(selectinload(Alert.pair))
        )
        result = await self.db.execute(query)
        alerts = result.scalars().all()
        
        triggered_count = 0
        from app.services.notification_service import NotificationService
        notification_service = NotificationService(self.db)
        
        for alert in alerts:
            # Check direction matching
            if alert.direction and alert.direction != "ANY" and alert.direction != signal.direction:
                continue
            # Check confidence matching
            if signal.confidence < alert.min_confidence:
                continue
                
            logger.info(f"Signal alert matched: Alert ID {alert.id} for User {alert.user_id}")
            
            payload = {
                "alert_id": str(alert.id),
                "alert_type": "signal",
                "pair": alert.pair.symbol if alert.pair else "Unknown",
                "direction": signal.direction,
                "confidence": signal.confidence,
                "entry": float(signal.entry),
                "stop": float(signal.stop),
                "target": float(signal.target),
                "setup": signal.setup
            }
            
            # Send notification
            await notification_service.send(
                user_id=alert.user_id,
                alert_id=alert.id,
                channels=alert.channels,
                payload=payload
            )
            
            # Update last triggered timestamp
            alert.last_triggered = datetime.utcnow()
            self.db.add(alert)
            triggered_count += 1
            
        await self.db.flush()
        return triggered_count
