"""Pydantic base schema for common fields and API responses."""
from datetime import datetime
from typing import Generic, TypeVar

from pydantic import BaseModel as PydanticBaseModel, ConfigDict

T = TypeVar("T")


class BaseSchema(PydanticBaseModel):
    """Base schema with common fields.

    All API schemas should inherit from this to ensure consistent serialization
    and configuration like ORM mode.
    """

    model_config = ConfigDict(from_attributes=True)

    id: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class APIResponse(PydanticBaseModel, Generic[T]):
    """Generic API response wrapper.

    All API responses follow this structure for consistency.

    Example:
        {
            "success": true,
            "data": {...},
            "error": null,
            "message": "Operation successful"
        }
    """

    success: bool = True
    data: T | None = None
    error: str | None = None
    message: str = "Success"


class PaginatedResponse(PydanticBaseModel, Generic[T]):
    """Generic paginated response wrapper.

    Used for endpoints that return collections of items.

    Example:
        {
            "success": true,
            "data": [...],
            "total": 100,
            "page": 1,
            "page_size": 20,
            "total_pages": 5
        }
    """

    success: bool = True
    data: list[T] = []
    total: int = 0
    page: int = 1
    page_size: int = 20
    total_pages: int = 1


class HealthCheck(PydanticBaseModel):
    """Health check response."""

    status: str = "healthy"
    version: str = "1.0.0"
    message: str = "Service is running"
