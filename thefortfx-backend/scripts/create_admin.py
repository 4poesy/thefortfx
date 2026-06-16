import asyncio
import sys
import os
import uuid

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import get_session
from app.models.user import Profile

async def create_admin(user_id_str: str, email: str):
    try:
        user_id = uuid.UUID(user_id_str)
    except ValueError:
        print("Error: Invalid UUID format")
        return
        
    print(f"Creating/updating admin user with ID {user_id} and email {email}...")
    
    async for db in get_session():
        from sqlalchemy import select
        existing = await db.execute(select(Profile).where(Profile.id == user_id))
        user = existing.scalar_one_or_none()
        
        if not user:
            user = Profile(
                id=user_id,
                email=email,
                display_name="Admin User",
                role="admin",
                experience_level="advanced",
                risk_appetite="medium",
                is_active=True
            )
            db.add(user)
            print("Admin profile created.")
        else:
            user.role = "admin"
            db.add(user)
            print("Existing profile upgraded to admin.")
            
        await db.commit()
        break
    print("Done.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python create_admin.py <supabase_user_uuid> <email>")
    else:
        asyncio.run(create_admin(sys.argv[1], sys.argv[2]))
