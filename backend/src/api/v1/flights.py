from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.db.session import get_db_session
from src.models.photo import Photo, PhotoMetadata
from src.schemas.base import APIResponse
from src.services.flight_service import FlightService
from src.schemas.photo import PhotoFilterRequest

router = APIRouter()

@router.post("/stats", response_model=APIResponse[dict])
async def get_flight_stats(
    filter_req: PhotoFilterRequest,
    db: AsyncSession = Depends(get_db_session)
) -> APIResponse[dict]:
    """Get flight statistics based on filters."""
    query = select(Photo).options(selectinload(Photo.metadata_))
    
    if filter_req.date_start:
        query = query.where(Photo.timestamp >= filter_req.date_start)
        
    if filter_req.date_end:
        query = query.where(Photo.timestamp <= filter_req.date_end)
        
    if filter_req.bounds:
        query = query.join(Photo.metadata_)
        query = query.where(
            (PhotoMetadata.latitude <= filter_req.bounds.north) &
            (PhotoMetadata.latitude >= filter_req.bounds.south) &
            (PhotoMetadata.longitude <= filter_req.bounds.east) &
            (PhotoMetadata.longitude >= filter_req.bounds.west)
        )
        
    result = await db.execute(query)
    photos = result.scalars().all()
    
    service = FlightService()
    stats = service.calculate_stats(photos)
    
    return APIResponse(data=stats)
