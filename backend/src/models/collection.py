"""Collection model."""
from typing import List, Optional, TYPE_CHECKING

from sqlalchemy import String, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import BaseModel

if TYPE_CHECKING:
    from src.models.photo import Photo
    # from src.models.flight import Flight  # TODO: Implement in Phase 7


class Collection(BaseModel):
    """Collection of photos and flights.

    A collection represents a logical grouping of photos, typically corresponding
    to a specific project, location, or day of flying.
    """

    __tablename__ = "collections"

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    total_photos: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    photos: Mapped[List["Photo"]] = relationship(
        "Photo", back_populates="collection", cascade="all, delete-orphan"
    )
    # flights: Mapped[List["Flight"]] = relationship(
    #     "Flight", back_populates="collection", cascade="all, delete-orphan"
    # )

    def __repr__(self) -> str:
        return f"<Collection {self.name}>"
