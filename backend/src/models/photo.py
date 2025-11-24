"""Photo and PhotoMetadata models."""
from datetime import datetime
from typing import Optional, TYPE_CHECKING

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import BaseModel

if TYPE_CHECKING:
    from src.models.collection import Collection


class Photo(BaseModel):
    """Photo model representing an image file."""

    __tablename__ = "photos"

    filename: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    file_path: Mapped[str] = mapped_column(String(1024), nullable=False, unique=True)
    file_hash: Mapped[str] = mapped_column(String(64), nullable=False, index=True)  # SHA-256 hash
    timestamp: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    file_size: Mapped[int] = mapped_column(Integer, nullable=False)  # in bytes
    format: Mapped[str] = mapped_column(String(10), nullable=False)  # jpg, png, etc.
    
    collection_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("collections.id", ondelete="CASCADE"), nullable=False
    )

    # Relationships
    collection: Mapped["Collection"] = relationship("Collection", back_populates="photos")
    metadata_: Mapped[Optional["PhotoMetadata"]] = relationship(
        "PhotoMetadata", back_populates="photo", uselist=False, cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Photo {self.filename}>"


class PhotoMetadata(BaseModel):
    """Extracted metadata from photo (EXIF/GPS)."""

    __tablename__ = "photo_metadata"

    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    altitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    camera_model: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    iso: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    shutter_speed: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    aperture: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    photo_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("photos.id", ondelete="CASCADE"), nullable=False, unique=True
    )

    # Relationships
    photo: Mapped["Photo"] = relationship("Photo", back_populates="metadata_")

    def __repr__(self) -> str:
        return f"<PhotoMetadata {self.latitude}, {self.longitude}>"
