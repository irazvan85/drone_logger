"""Location endpoints."""
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db_session
from src.schemas.location import PhotoMarkerResponse
from src.services.location_service import LocationService

router = APIRouter()


@router.get("", response_model=List[PhotoMarkerResponse])
async def get_locations(
    session: AsyncSession = Depends(get_db_session)
):
    """Get all photo locations/markers for map display.
    
    Returns:
        List of markers with GPS coordinates
    """
    service = LocationService(session)
    return await service.get_all_markers()
