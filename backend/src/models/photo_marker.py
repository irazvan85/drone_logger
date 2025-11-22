"""Photo Marker model for map visualization."""
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import BaseModel

if TYPE_CHECKING:
    from src.models.gps_location import GPSLocation


class PhotoMarker(BaseModel):
    """Photo Marker model for map display."""

    __tablename__ = "photo_markers"

    location_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("gps_locations.id", ondelete="CASCADE"), nullable=False
    )
    photos_count: Mapped[int] = mapped_column(Integer, default=1)
    is_clustered: Mapped[bool] = mapped_column(Boolean, default=False)
    visible: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    location: Mapped["GPSLocation"] = relationship("GPSLocation", back_populates="markers")

    def __repr__(self) -> str:
        return f"<PhotoMarker loc={self.location_id} count={self.photos_count}>"
