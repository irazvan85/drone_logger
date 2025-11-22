"""Pydantic schemas for Photo."""
from datetime import datetime
from typing import Optional, List

from pydantic import Field

from src.schemas.base import BaseSchema


class PhotoMetadataBase(BaseSchema):
    """Base properties for PhotoMetadata."""
    latitude: float
    longitude: float
    altitude: Optional[float] = None
    camera_model: Optional[str] = None
    iso: Optional[int] = None
    shutter_speed: Optional[str] = None
    aperture: Optional[str] = None


class PhotoBase(BaseSchema):
    """Base properties for Photo."""
    filename: str
    file_path: str
    timestamp: datetime
    file_size: int
    format: str
    collection_id: str


class PhotoResponse(PhotoBase):
    """Properties to return to client."""
    metadata_: Optional[PhotoMetadataBase] = Field(None, serialization_alias="metadata")


class PhotoImportRequest(BaseSchema):
    """Request schema for importing photos."""
    folder_path: str = Field(..., min_length=1)
    collection_id: str


class ImportStats(BaseSchema):
    """Statistics for import operation."""
    total_scanned: int
    total_imported: int
    successful: int
    failed: int
    errors: List[str]


class Bounds(BaseSchema):
    """Geographic bounds."""
    north: float
    south: float
    east: float
    west: float


class PhotoFilterRequest(BaseSchema):
    """Request schema for filtering photos."""
    date_start: Optional[datetime] = None
    date_end: Optional[datetime] = None
    bounds: Optional[Bounds] = None
