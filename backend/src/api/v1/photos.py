"""Photo endpoints."""
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.db.session import get_db_session
from src.models.photo import Photo, PhotoMetadata
from src.schemas.base import APIResponse
from src.schemas.photo import PhotoImportRequest, ImportStats, PhotoResponse, PhotoFilterRequest
from src.services.photo_processor import PhotoProcessor
from src.utils.file_utils import validate_path

router = APIRouter()


@router.post("/import", response_model=APIResponse[ImportStats])
async def import_photos(
    import_req: PhotoImportRequest,
    db: AsyncSession = Depends(get_db_session)
) -> APIResponse[ImportStats]:
    """Import photos from a folder."""
    processor = PhotoProcessor(db)
    
    # Validate path
    folder_path = validate_path(import_req.folder_path)
    
    stats = await processor.process_folder(
        folder_path=folder_path,
        collection_id=import_req.collection_id
    )
    
    return APIResponse(data=stats)


@router.post("/filter", response_model=APIResponse[List[PhotoResponse]])
async def filter_photos(
    filter_req: PhotoFilterRequest,
    db: AsyncSession = Depends(get_db_session)
) -> APIResponse[List[PhotoResponse]]:
    """Filter photos by date and location."""
    query = select(Photo).options(selectinload(Photo.metadata_))
    
    if filter_req.date_start:
        query = query.where(Photo.timestamp >= filter_req.date_start)
        
    if filter_req.date_end:
        query = query.where(Photo.timestamp <= filter_req.date_end)
        
    if filter_req.bounds:
        # Join with metadata to filter by location
        query = query.join(Photo.metadata_)
        query = query.where(
            (PhotoMetadata.latitude <= filter_req.bounds.north) &
            (PhotoMetadata.latitude >= filter_req.bounds.south) &
            (PhotoMetadata.longitude <= filter_req.bounds.east) &
            (PhotoMetadata.longitude >= filter_req.bounds.west)
        )
        
    result = await db.execute(query)
    photos = result.scalars().all()
    
    return APIResponse(data=photos)


@router.get("/", response_model=APIResponse[List[PhotoResponse]])
async def list_photos(
    skip: int = 0,
    limit: int = 100,
    collection_id: str = None,
    db: AsyncSession = Depends(get_db_session)
) -> APIResponse[List[PhotoResponse]]:
    """List photos."""
    query = select(Photo).options(selectinload(Photo.metadata_))
    
    if collection_id:
        query = query.where(Photo.collection_id == collection_id)
        
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    photos = result.scalars().all()
    
    return APIResponse(data=photos)


@router.get("/{photo_id}", response_model=APIResponse[PhotoResponse])
async def get_photo(
    photo_id: str,
    db: AsyncSession = Depends(get_db_session)
) -> APIResponse[PhotoResponse]:
    """Get a specific photo."""
    query = select(Photo).options(selectinload(Photo.metadata_)).where(Photo.id == photo_id)
    result = await db.execute(query)
    photo = result.scalar_one_or_none()
    
    if not photo:
        # TODO: Use proper exception handler
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Photo not found")
        
    return APIResponse(data=photo)
