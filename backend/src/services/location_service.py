"""Location service for managing GPS locations and markers."""
from typing import List
import logging

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.models.photo import PhotoMetadata
from src.models.gps_location import GPSLocation
from src.models.photo_marker import PhotoMarker
from src.utils.clustering import cluster_photos

logger = logging.getLogger(__name__)


class LocationService:
    """Service for handling location and map marker operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all_markers(self) -> List[PhotoMarker]:
        """Get all photo markers with their locations.
        
        Returns:
            List of PhotoMarker objects with loaded location relationship
        """
        stmt = select(PhotoMarker).options(selectinload(PhotoMarker.location))
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def regenerate_markers(self) -> int:
        """Regenerate all markers from photo metadata.
        
        Returns:
            Number of markers created
        """
        # 1. Clear existing data
        await self.session.execute(delete(PhotoMarker))
        await self.session.execute(delete(GPSLocation))
        
        # 2. Fetch all metadata
        stmt = select(PhotoMetadata)
        result = await self.session.execute(stmt)
        metadata_list = list(result.scalars().all())
        
        if not metadata_list:
            return 0

        # 3. Cluster photos
        clusters = cluster_photos(metadata_list)
        
        # 4. Create entities
        markers_count = 0
        for cluster in clusters:
            location = GPSLocation(
                latitude=cluster["latitude"],
                longitude=cluster["longitude"],
                altitude=0.0,  # TODO: Average altitude
                uncertainty_radius=10.0
            )
            self.session.add(location)
            await self.session.flush()  # Get ID
            
            marker = PhotoMarker(
                location_id=location.id,
                photos_count=cluster["count"],
                is_clustered=cluster["count"] > 1,
                visible=True
            )
            self.session.add(marker)
            markers_count += 1
            
        await self.session.commit()
        logger.info(f"Regenerated {markers_count} markers from {len(metadata_list)} photos")
        return markers_count
