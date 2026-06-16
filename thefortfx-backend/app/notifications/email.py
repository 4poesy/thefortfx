from __future__ import annotations
import uuid
import asyncio
import resend
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.user import Profile
from app.core.logging import get_logger

logger = get_logger("app.notifications.email")
settings = get_settings()

if settings.RESEND_API_KEY:
    resend.api_key = settings.RESEND_API_KEY

async def send_email_notification(user_id: uuid.UUID, payload: dict, db: AsyncSession) -> None:
    """Dispatches a formatted HTML alert email to the user using Resend."""
    if not settings.RESEND_API_KEY:
        logger.warning("Resend API Key is not configured. Skipping email notification.")
        return
        
    # Resolve recipient email
    query = select(Profile.email).where(Profile.id == user_id)
    res = await db.execute(query)
    email = res.scalar_one_or_none()
    
    if not email:
        logger.warning(f"No email address found for user {user_id}. Skipping.")
        return
        
    alert_type = payload.get("alert_type", "alert")
    pair = payload.get("pair", "Unknown Pair")
    
    # Build HTML email
    if alert_type == "signal":
        direction = payload.get("direction", "NEUTRAL")
        color = "#22C55E" if direction == "BUY" else "#EF4444" if direction == "SELL" else "#6B7280"
        
        subject = f"⚡ TheFortFX Signal Alert: {pair} — {direction}"
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #0B0F19; color: #FFFFFF; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #1F2937; border-radius: 12px; padding: 30px; background-color: #111827;">
                <h2 style="color: #3B82F6; margin-top: 0; font-size: 24px;">TheFortFX Signal Update</h2>
                <div style="background-color: {color}; color: #FFFFFF; padding: 10px 15px; border-radius: 6px; font-weight: bold; display: inline-block; margin-bottom: 20px; font-size: 16px;">
                    {pair} — {direction}
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; color: #D1D5DB;">
                    <tr>
                        <td style="padding: 10px 0; color: #9CA3AF; border-bottom: 1px solid #1F2937;">Entry Price</td>
                        <td style="padding: 10px 0; text-align: right; font-weight: bold; border-bottom: 1px solid #1F2937;">{payload.get('entry')}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #9CA3AF; border-bottom: 1px solid #1F2937;">Stop Loss</td>
                        <td style="padding: 10px 0; text-align: right; font-weight: bold; border-bottom: 1px solid #1F2937; color: #EF4444;">{payload.get('stop')}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #9CA3AF; border-bottom: 1px solid #1F2937;">Take Profit</td>
                        <td style="padding: 10px 0; text-align: right; font-weight: bold; border-bottom: 1px solid #1F2937; color: #22C55E;">{payload.get('target')}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #9CA3AF; border-bottom: 1px solid #1F2937;">Confidence</td>
                        <td style="padding: 10px 0; text-align: right; font-weight: bold; border-bottom: 1px solid #1F2937;">{payload.get('confidence')}%</td>
                    </tr>
                </table>
                <p style="color: #9CA3AF; font-style: italic; margin-bottom: 20px; font-size: 15px;">Setup: {payload.get('setup')}</p>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="{settings.APP_URL}/dashboard" style="background-color: #3B82F6; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">Go to Dashboard</a>
                </div>
            </div>
        </body>
        </html>
        """
    else:
        subject = f"🔔 TheFortFX Alert: {pair} — {alert_type.capitalize()}"
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #0B0F19; color: #FFFFFF; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #1F2937; border-radius: 12px; padding: 30px; background-color: #111827;">
                <h2 style="color: #3B82F6; margin-top: 0; font-size: 24px;">TheFortFX Alert</h2>
                <p style="font-size: 16px; color: #D1D5DB;">Your alert criteria for <strong>{pair}</strong> has been met.</p>
                <div style="background-color: #1F2937; padding: 15px; border-radius: 8px; color: #FFFFFF; font-family: monospace; margin: 20px 0; font-size: 14px;">
                    Alert Type: {alert_type.capitalize()}<br/>
                    Details: {payload.get('message', 'Alert condition triggered.')}
                </div>
            </div>
        </body>
        </html>
        """

    # Wrap synchronous Resend call in a thread executor
    def _run_send():
        return resend.Emails.send({
            "from": settings.RESEND_FROM_EMAIL,
            "to": email,
            "subject": subject,
            "html": html_content
        })

    loop = asyncio.get_running_loop()
    await loop.run_in_executor(None, _run_send)
    logger.info(f"Email alert successfully dispatched to {email}")
