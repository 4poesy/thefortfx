from __future__ import annotations
import uuid
from typing import Any, Generic, Type, TypeVar, Optional, List, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import Base

ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
    """Generic CRUD repository class containing standard database query patterns."""
    def __init__(self, model: Type[ModelType], db: AsyncSession) -> None:
        self.model = model
        self.db = db

    async def get(self, id: uuid.UUID) -> Optional[ModelType]:
        """Fetches a single model instance by its UUID."""
        query = select(self.model).where(self.model.id == id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_multi(
        self,
        *,
        skip: int = 0,
        limit: int = 20,
        filters: Optional[dict[str, Any]] = None,
        order_by: Optional[str] = None
    ) -> Tuple[List[ModelType], int]:
        """Fetches a paginated list of models with dynamic filtering and sorting."""
        query = select(self.model)
        
        # Apply filters
        if filters:
            for field, val in filters.items():
                if hasattr(self.model, field) and val is not None:
                    query = query.where(getattr(self.model, field) == val)
                    
        # Count total records matching filters
        count_query = select(func.count()).select_from(query.subquery())
        count_result = await self.db.execute(count_query)
        total_count = count_result.scalar_one()
        
        # Apply ordering
        if order_by:
            direction = "asc"
            field_name = order_by
            if order_by.startswith("-"):
                direction = "desc"
                field_name = order_by[1:]
            
            if hasattr(self.model, field_name):
                field_attr = getattr(self.model, field_name)
                query = query.order_by(field_attr.desc() if direction == "desc" else field_attr.asc())
        
        # Offset and limit
        query = query.offset(skip).limit(limit)
        
        result = await self.db.execute(query)
        items = list(result.scalars().all())
        
        return items, total_count

    async def create(self, obj_in: dict[str, Any]) -> ModelType:
        """Creates a new record in the database."""
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        await self.db.flush()
        return db_obj

    async def update(self, id: uuid.UUID, obj_in: dict[str, Any]) -> Optional[ModelType]:
        """Updates select fields on an existing record."""
        db_obj = await self.get(id)
        if not db_obj:
            return None
            
        for field, value in obj_in.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)
                
        self.db.add(db_obj)
        await self.db.flush()
        return db_obj

    async def delete(self, id: uuid.UUID) -> bool:
        """Deletes a record by its UUID."""
        db_obj = await self.get(id)
        if not db_obj:
            return False
            
        await self.db.delete(db_obj)
        await self.db.flush()
        return True
