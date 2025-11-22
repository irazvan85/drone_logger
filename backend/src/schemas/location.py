"""Location schemas."""
from typing import Optional
from pydantic import BaseModel, ConfigDict


class GPSLocationBase(BaseModel):
    """Base schema for GPS Location."""
    latitude: float
    longitude: float
    altitude: Optional[float] = None
    uncertainty_radius: Optional[float] = None


class GPSLocationResponse(GPSLocationBase):
    """Response schema for GPS Location."""
    id: str
    
    model_config = ConfigDict(from_attributes=True)


class PhotoMarkerBase(BaseModel):
    """Base schema for Photo Marker."""
    photos_count: int = 1
    is_clustered: bool = False
    visible: bool = True


class PhotoMarkerResponse(PhotoMarkerBase):
    """Response schema for Photo Marker."""
    id: str
    location: GPSLocationResponse
    
    model_config = ConfigDict(from_attributes=True)
