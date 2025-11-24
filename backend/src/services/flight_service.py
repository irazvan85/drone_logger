from typing import List, Dict, Any, Optional
from datetime import datetime
from src.models.photo import Photo
from src.utils.gps import calculate_distance, Coordinate

class FlightService:
    """Service for calculating flight statistics."""

    def calculate_stats(self, photos: List[Photo]) -> Dict[str, Any]:
        """Calculate statistics for a list of photos.
        
        Args:
            photos: List of Photo objects
            
        Returns:
            Dictionary containing:
            - total_distance_meters: Total distance in meters
            - total_photos: Number of photos
            - date_start: Timestamp of first photo
            - date_end: Timestamp of last photo
        """
        if not photos:
            return {
                "total_distance_meters": 0,
                "total_photos": 0,
                "date_start": None,
                "date_end": None,
                "total_duration_seconds": 0
            }
            
        # Sort photos by time
        sorted_photos = sorted(photos, key=lambda p: p.timestamp)
        
        total_distance_km = 0.0
        
        for i in range(len(sorted_photos) - 1):
            p1 = sorted_photos[i]
            p2 = sorted_photos[i+1]
            
            if p1.metadata_ and p2.metadata_:
                c1 = Coordinate(p1.metadata_.latitude, p1.metadata_.longitude)
                c2 = Coordinate(p2.metadata_.latitude, p2.metadata_.longitude)
                total_distance_km += calculate_distance(c1, c2)
                
        return {
            "total_distance_meters": total_distance_km * 1000,
            "total_photos": len(photos),
            "date_start": sorted_photos[0].timestamp,
            "date_end": sorted_photos[-1].timestamp,
            "total_duration_seconds": (sorted_photos[-1].timestamp - sorted_photos[0].timestamp).total_seconds()
        }
