"""Clustering utilities for photo locations."""
from typing import List, Dict, Tuple
from math import radians, cos, sin, asin, sqrt

from src.models.photo import PhotoMetadata


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance between two points in meters."""
    R = 6371000  # Earth radius in meters

    dLat = radians(lat2 - lat1)
    dLon = radians(lon2 - lon1)
    
    a = sin(dLat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dLon / 2) ** 2
    c = 2 * asin(sqrt(a))
    
    return R * c


def cluster_photos(metadata_list: List[PhotoMetadata], radius_meters: float = 10.0) -> List[Dict]:
    """Cluster photos based on geographic proximity.
    
    Args:
        metadata_list: List of PhotoMetadata objects
        radius_meters: Distance in meters to group photos
        
    Returns:
        List of dicts containing:
        - latitude: Center latitude
        - longitude: Center longitude
        - count: Number of photos
        - photo_ids: List of photo IDs in this cluster
    """
    clusters = []
    processed_ids = set()

    for item in metadata_list:
        if item.photo_id in processed_ids:
            continue

        # Start a new cluster
        current_cluster = {
            "latitude": item.latitude,
            "longitude": item.longitude,
            "count": 1,
            "photo_ids": [item.photo_id]
        }
        processed_ids.add(item.photo_id)

        # Find neighbors
        for neighbor in metadata_list:
            if neighbor.photo_id in processed_ids:
                continue

            dist = haversine_distance(
                item.latitude, item.longitude,
                neighbor.latitude, neighbor.longitude
            )

            if dist <= radius_meters:
                current_cluster["count"] += 1
                current_cluster["photo_ids"].append(neighbor.photo_id)
                processed_ids.add(neighbor.photo_id)
                
                # Update centroid (simple average)
                # Note: This is a simplification. For better accuracy, 
                # we should re-average after all neighbors are found or use K-means.
                # For MVP, keeping the first point as anchor is acceptable or simple running average.
                # Let's do running average for slightly better center.
                n = current_cluster["count"]
                current_cluster["latitude"] = (current_cluster["latitude"] * (n-1) + neighbor.latitude) / n
                current_cluster["longitude"] = (current_cluster["longitude"] * (n-1) + neighbor.longitude) / n

        clusters.append(current_cluster)

    return clusters
