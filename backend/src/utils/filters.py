from datetime import datetime
from typing import List, Dict, Any, Optional
from src.models.photo import Photo

def filter_by_date_range(photos: List[Photo], start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> List[Photo]:
    """Filter photos by date range."""
    if not start_date and not end_date:
        return photos
    
    filtered = []
    for photo in photos:
        if start_date and photo.timestamp < start_date:
            continue
        if end_date and photo.timestamp > end_date:
            continue
        filtered.append(photo)
    return filtered

def filter_by_bounds(photos: List[Photo], bounds: Dict[str, float]) -> List[Photo]:
    """Filter photos by geographic bounds."""
    # bounds: {north, south, east, west}
    if not bounds:
        return photos
        
    north = bounds.get("north")
    south = bounds.get("south")
    east = bounds.get("east")
    west = bounds.get("west")
    
    if north is None or south is None or east is None or west is None:
        return photos

    filtered = []
    for photo in photos:
        if not photo.metadata_:
            continue
            
        lat = photo.metadata_.latitude
        lon = photo.metadata_.longitude
        
        if south <= lat <= north and west <= lon <= east:
            filtered.append(photo)
            
    return filtered

def apply_filters(photos: List[Photo], filters: Dict[str, Any]) -> List[Photo]:
    """Apply all filters to photos."""
    result = photos
    
    if "date_start" in filters or "date_end" in filters:
        start = filters.get("date_start")
        end = filters.get("date_end")
        result = filter_by_date_range(result, start, end)
        
    if "bounds" in filters:
        result = filter_by_bounds(result, filters["bounds"])
        
    return result
