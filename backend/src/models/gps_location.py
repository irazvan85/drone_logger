"""GPS Location model."""
from typing import TYPE_CHECKING, List

from sqlalchemy import Float, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import BaseModel

if TYPE_CHECKING:
    from src.models.photo_marker import PhotoMarker


class GPSLocation(BaseModel):
    """GPS Location model representing a unique geographic point."""

    __tablename__ = "gps_locations"

    latitude: Mapped[float] = mapped_column(Float, nullable=False, index=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=False, index=True)
    altitude: Mapped[float] = mapped_column(Float, nullable=True)
    uncertainty_radius: Mapped[float] = mapped_column(Float, nullable=True)  # in meters

    # Relationships
    markers: Mapped[List["PhotoMarker"]] = relationship("PhotoMarker", back_populates="location")

    def __repr__(self) -> str:
        return f"<GPSLocation {self.latitude}, {self.longitude}>"
