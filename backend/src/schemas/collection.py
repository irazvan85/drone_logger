"""Pydantic schemas for Collection."""
from typing import Optional

from pydantic import Field

from src.schemas.base import BaseSchema


class CollectionBase(BaseSchema):
    """Base properties for Collection."""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class CollectionCreate(CollectionBase):
    """Properties to receive on item creation."""
    pass


class CollectionUpdate(CollectionBase):
    """Properties to receive on item update."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)


class CollectionResponse(CollectionBase):
    """Properties to return to client."""
    total_photos: int = 0
