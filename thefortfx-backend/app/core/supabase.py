from __future__ import annotations
from supabase import create_client, Client
from app.config import get_settings

settings = get_settings()

# Initialize the Supabase Admin client
_supabase_client: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY
)

def get_supabase() -> Client:
    """Returns the initialized Supabase administrative client instance."""
    return _supabase_client
