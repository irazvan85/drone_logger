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
    from sqlalchemy.orm import selectinload
    
    # 1. Build query with eager loading of metadata
    query = select(Photo).options(selectinload(Photo.metadata_))
    
    # If photo_ids provided, filter by them at DB level
    if request.photo_ids:
        query = query.where(Photo.id.in_(request.photo_ids))
    
    # Execute query
    result = await db.execute(query)
    photos = list(result.scalars().all())
    
    # 2. Apply in-memory filters (date range)
    filters = {}
    if request.date_start:
        filters["date_start"] = request.date_start
    if request.date_end:
        filters["date_end"] = request.date_end
        
    if filters:
        photos = apply_filters(photos, filters)

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
