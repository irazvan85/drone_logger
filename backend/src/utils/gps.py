"""Geospatial utilities for GPS calculations and coordinate operations."""
from math import acos, cos, radians, sin
from typing import NamedTuple, Optional


class Coordinate(NamedTuple):
    """GPS coordinate."""

    latitude: float
    longitude: float


def calculate_distance(coord1: Coordinate, coord2: Coordinate) -> float:
    """Calculate distance between two GPS coordinates in kilometers.

    Uses Haversine formula for accurate distance calculation on Earth's surface.

    Args:
        coord1: First coordinate (latitude, longitude)
        coord2: Second coordinate (latitude, longitude)

    Returns:
        Distance in kilometers

    Raises:
        ValueError: If coordinates are invalid

    Example:
        >>> coord1 = Coordinate(37.7749, -122.4194)  # San Francisco
        >>> coord2 = Coordinate(40.7128, -74.0060)   # New York
        >>> distance = calculate_distance(coord1, coord2)
        >>> round(distance, 0)
        4130.0
    """
    from math import asin, sqrt

    if not _is_valid_coordinate(coord1) or not _is_valid_coordinate(coord2):
        raise ValueError("Invalid coordinates provided")

    lat1, lon1 = radians(coord1.latitude), radians(coord1.longitude)
    lat2, lon2 = radians(coord2.latitude), radians(coord2.longitude)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))

    earth_radius_km = 6371
    return earth_radius_km * c


def calculate_bounds(coordinates: list[Coordinate]) -> dict[str, float]:
    """Calculate bounding box for a list of coordinates.

    Useful for centering and zooming maps.

    Args:
        coordinates: List of GPS coordinates

    Returns:
        Dictionary with min/max latitude and longitude

    Raises:
        ValueError: If coordinates list is empty

    Example:
        >>> coords = [
        ...     Coordinate(37.7749, -122.4194),
        ...     Coordinate(37.8044, -122.2712),
        ... ]
        >>> bounds = calculate_bounds(coords)
        >>> bounds['min_lat']
        37.7749
    """
    if not coordinates:
        raise ValueError("Coordinates list cannot be empty")

    lats = [c.latitude for c in coordinates]
    lons = [c.longitude for c in coordinates]

    return {
        "min_lat": min(lats),
        "max_lat": max(lats),
        "min_lon": min(lons),
        "max_lon": max(lons),
    }


def calculate_center(coordinates: list[Coordinate]) -> Coordinate:
    """Calculate geographic center of coordinates.

    Args:
        coordinates: List of GPS coordinates

    Returns:
        Center coordinate (average of all points)

    Raises:
        ValueError: If coordinates list is empty
    """
    if not coordinates:
        raise ValueError("Coordinates list cannot be empty")

    avg_lat = sum(c.latitude for c in coordinates) / len(coordinates)
    avg_lon = sum(c.longitude for c in coordinates) / len(coordinates)

    return Coordinate(avg_lat, avg_lon)


def calculate_bearing(from_coord: Coordinate, to_coord: Coordinate) -> float:
    """Calculate initial bearing between two coordinates in degrees.

    Bearing is measured clockwise from north (0-360 degrees).

    Args:
        from_coord: Starting coordinate
        to_coord: Destination coordinate

    Returns:
        Bearing in degrees (0-360)

    Raises:
        ValueError: If coordinates are invalid
    """
    if not _is_valid_coordinate(from_coord) or not _is_valid_coordinate(to_coord):
        raise ValueError("Invalid coordinates provided")

    lat1 = radians(from_coord.latitude)
    lat2 = radians(to_coord.latitude)
    dlon = radians(to_coord.longitude - from_coord.longitude)

    x = sin(dlon) * cos(lat2)
    y = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(dlon)

    bearing = (180 + (180 / 3.14159) * atan2(x, y)) % 360

    return bearing


def _is_valid_coordinate(coord: Coordinate) -> bool:
    """Validate GPS coordinate ranges.

    Args:
        coord: Coordinate to validate

    Returns:
        True if valid, False otherwise
    """
    return -90 <= coord.latitude <= 90 and -180 <= coord.longitude <= 180


def simplify_path(coordinates: list[Coordinate], tolerance: float = 0.0001) -> list[Coordinate]:
    """Simplify a path using Ramer-Douglas-Peucker algorithm.

    Reduces number of points while maintaining path shape. Useful for
    reducing data size when displaying flight paths on maps.

    Args:
        coordinates: List of coordinates in order
        tolerance: Tolerance distance in decimal degrees (default: 0.0001 ≈ 11m)

    Returns:
        Simplified list of coordinates

    Raises:
        ValueError: If coordinates list has fewer than 3 points
    """
    if len(coordinates) < 3:
        return coordinates

    def perpendicular_distance(point: Coordinate, start: Coordinate, end: Coordinate) -> float:
        """Calculate perpendicular distance from point to line."""
        if start == end:
            return _point_distance(point, start)

        x = point.latitude
        y = point.longitude
        x1, y1 = start.latitude, start.longitude
        x2, y2 = end.latitude, end.longitude

        numerator = abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1)
        denominator = ((y2 - y1) ** 2 + (x2 - x1) ** 2) ** 0.5

        return numerator / denominator if denominator else 0

    def _point_distance(p1: Coordinate, p2: Coordinate) -> float:
        """Calculate Euclidean distance between two points."""
        return ((p1.latitude - p2.latitude) ** 2 + (p1.longitude - p2.longitude) ** 2) ** 0.5

    max_dist = 0
    max_index = 0

    for i in range(1, len(coordinates) - 1):
        dist = perpendicular_distance(coordinates[i], coordinates[0], coordinates[-1])
        if dist > max_dist:
            max_dist = dist
            max_index = i

    if max_dist > tolerance:
        left = simplify_path(coordinates[: max_index + 1], tolerance)
        right = simplify_path(coordinates[max_index:], tolerance)
        return left[:-1] + right
    else:
        return [coordinates[0], coordinates[-1]]


from math import atan2

# Re-export atan2 for bearing calculation
