from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from src.db.session import get_db_session
from src.models.photo import Photo
from src.schemas.export import ExportRequest
from src.services.export_service import ExportService
from src.utils.filters import apply_filters

router = APIRouter()

@router.post("", response_class=Response)
async def export_data(
    request: ExportRequest,
    db: AsyncSession = Depends(get_db_session)
):
    # 1. Fetch photos based on criteria
    query = select(Photo)
    
    # If photo_ids provided, filter by them
    if request.photo_ids:
        query = query.where(Photo.id.in_(request.photo_ids))
    else:
        # Apply date filters if provided
        # We need to adapt apply_filters or write custom logic here
        # For now, let's assume simple filtering or fetch all if no ids
        # Ideally we reuse the filter logic from photos.py
        pass 
        # TODO: Integrate with apply_filters properly if needed, 
        # but for now let's stick to basic ID filtering or all if not specified
        # (or maybe we should require some filter?)
    
    # Execute query
    result = await db.execute(query)
    photos = result.scalars().all()
    
    # Ensure metadata is loaded (eager loading might be needed or it's lazy loaded)
    # With AsyncSession, lazy loading attributes fails. We should use select options to join metadata.
    # Let's update the query to join metadata.
    from sqlalchemy.orm import selectinload
    query = query.options(selectinload(Photo.metadata_))
    result = await db.execute(query)
    photos = result.scalars().all()

    service = ExportService()
    
    if request.format.lower() == "geojson":
        data = service.export_to_geojson(photos)
        import json
        content = json.dumps(data)
        media_type = "application/geo+json"
        filename = "export.geojson"
    elif request.format.lower() == "csv":
        content = service.export_to_csv(photos)
        media_type = "text/csv"
        filename = "export.csv"
    elif request.format.lower() == "kml":
        content = service.export_to_kml(photos)
        media_type = "application/vnd.google-earth.kml+xml"
        filename = "export.kml"
    else:
        raise HTTPException(status_code=400, detail="Unsupported format")
        
    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
