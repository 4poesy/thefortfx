import uuid
import jwt
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.dependencies import get_db, get_current_user
from app.models.user import Profile
from app.schemas.user import ProfileResponse
from app.schemas.common import BaseResponse
from app.repositories.user import UserRepository

router = APIRouter()
settings = get_settings()
security = HTTPBearer()

@router.post("/sync-profile", response_model=BaseResponse[ProfileResponse])
async def sync_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
):
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {str(e)}"
        )

    user_id_str = payload.get("sub")
    email = payload.get("email")
    if not user_id_str or not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token payload is missing sub or email claims"
        )

    try:
        user_id = uuid.UUID(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format in token"
        )

    user_repo = UserRepository(db)
    user = await user_repo.get(user_id)
    
    metadata = payload.get("user_metadata", {})
    display_name = metadata.get("full_name") or metadata.get("name") or email.split("@")[0]
    avatar_url = metadata.get("avatar_url")

    if not user:
        user = Profile(
            id=user_id,
            email=email,
            display_name=display_name,
            avatar_url=avatar_url,
            role="free",
            experience_level="beginner",
            risk_appetite="medium",
            is_active=True,
            last_seen_at=datetime.utcnow()
        )
        # Create and commit using repository
        db.add(user)
        await db.commit()
        await db.refresh(user)
    else:
        user.last_seen_at = datetime.utcnow()
        if avatar_url:
            user.avatar_url = avatar_url
        await db.commit()
        await db.refresh(user)

    return BaseResponse(data=user, message="Profile synced successfully")

@router.get("/me", response_model=BaseResponse[ProfileResponse])
async def get_me(current_user: Profile = Depends(get_current_user)):
    return BaseResponse(data=current_user)

@router.post("/logout")
async def logout():
    return {"success": True, "message": "Logged out successfully"}
