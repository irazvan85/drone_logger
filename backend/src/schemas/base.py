"""Pydantic base schema for common fields."""
from datetime import datetime

from pydantic import BaseModel as PydanticBaseModel, ConfigDict


class BaseSchema(PydanticBaseModel):
    """Base schema with common fields."""

    model_config = ConfigDict(from_attributes=True)

    id: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
