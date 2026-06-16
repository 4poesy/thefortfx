from __future__ import annotations
from typing import Generic, TypeVar, Optional, List
from pydantic import BaseModel

T = TypeVar("T")

class BaseResponse(BaseModel, Generic[T]):
    """Standard generic wrapper for all API responses."""
    success: bool = True
    data: T
    message: Optional[str] = None

class PaginatedResponse(BaseModel, Generic[T]):
    """Generic wrapper for paginated lists."""
    success: bool = True
    data: List[T]
    total: int
    page: int
    limit: int
    total_pages: int
    has_next: bool
    has_prev: bool

class ErrorResponse(BaseModel):
    """Standard wrapper for API error responses."""
    success: bool = False
    error: str
    detail: Optional[str] = None
    code: Optional[str] = None
