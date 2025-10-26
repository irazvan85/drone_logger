"""Unit tests for geospatial utility functions."""
import pytest
from math import isclose

from src.utils.gps import (
    Coordinate,
    calculate_bearing,
    calculate_bounds,
    calculate_center,
    calculate_distance,
    simplify_path,
)


class TestCoordinate:
    """Test Coordinate named tuple."""

    def test_coordinate_creation(self):
        """Test Coordinate creation."""
        coord = Coordinate(37.7749, -122.4194)
        assert coord.latitude == 37.7749
        assert coord.longitude == -122.4194

    def test_coordinate_unpacking(self):
        """Test Coordinate unpacking."""
        lat, lon = Coordinate(37.7749, -122.4194)
        assert lat == 37.7749
        assert lon == -122.4194


class TestCalculateDistance:
    """Test distance calculation function."""

    def test_same_coordinate_distance(self):
        """Test distance between same coordinates is 0."""
        coord = Coordinate(37.7749, -122.4194)
        distance = calculate_distance(coord, coord)
        assert isclose(distance, 0, abs_tol=0.01)

    def test_valid_distance_calculation(self):
        """Test distance calculation between cities."""
        sf = Coordinate(37.7749, -122.4194)  # San Francisco
        ny = Coordinate(40.7128, -74.0060)   # New York
        distance = calculate_distance(sf, ny)
        # Actual distance is approximately 4130 km
        assert 4100 < distance < 4200

    def test_invalid_latitude(self):
        """Test with invalid latitude raises ValueError."""
        invalid_coord = Coordinate(91, 0)  # Invalid latitude
        valid_coord = Coordinate(0, 0)
        with pytest.raises(ValueError):
            calculate_distance(invalid_coord, valid_coord)

    def test_invalid_longitude(self):
        """Test with invalid longitude raises ValueError."""
        invalid_coord = Coordinate(0, 181)  # Invalid longitude
        valid_coord = Coordinate(0, 0)
        with pytest.raises(ValueError):
            calculate_distance(valid_coord, invalid_coord)


class TestCalculateBounds:
    """Test bounding box calculation."""

    def test_bounds_calculation(self):
        """Test bounding box calculation."""
        coords = [
            Coordinate(37.7749, -122.4194),
            Coordinate(37.8044, -122.2712),
        ]
        bounds = calculate_bounds(coords)
        assert bounds["min_lat"] == 37.7749
        assert bounds["max_lat"] == 37.8044
        assert bounds["min_lon"] == -122.4194
        assert bounds["max_lon"] == -122.2712

    def test_empty_coordinates_raises_error(self):
        """Test empty coordinates list raises ValueError."""
        with pytest.raises(ValueError):
            calculate_bounds([])


class TestCalculateCenter:
    """Test center calculation."""

    def test_center_calculation(self):
        """Test geographic center calculation."""
        coords = [
            Coordinate(0, 0),
            Coordinate(10, 10),
        ]
        center = calculate_center(coords)
        assert center.latitude == 5
        assert center.longitude == 5

    def test_single_coordinate_center(self):
        """Test center of single coordinate is itself."""
        coord = Coordinate(37.7749, -122.4194)
        center = calculate_center([coord])
        assert center.latitude == coord.latitude
        assert center.longitude == coord.longitude

    def test_empty_coordinates_raises_error(self):
        """Test empty coordinates list raises ValueError."""
        with pytest.raises(ValueError):
            calculate_center([])


class TestCalculateBearing:
    """Test bearing calculation."""

    def test_bearing_north(self):
        """Test bearing calculation (north direction)."""
        from_coord = Coordinate(0, 0)
        to_coord = Coordinate(1, 0)
        bearing = calculate_bearing(from_coord, to_coord)
        # Should be close to 0 (north)
        assert 0 <= bearing < 360

    def test_invalid_coordinates_raises_error(self):
        """Test invalid coordinates raise ValueError."""
        invalid_coord = Coordinate(91, 0)
        valid_coord = Coordinate(0, 0)
        with pytest.raises(ValueError):
            calculate_bearing(invalid_coord, valid_coord)


class TestSimplifyPath:
    """Test path simplification."""

    def test_simplify_path_with_collinear_points(self):
        """Test simplifying path with collinear points."""
        coords = [
            Coordinate(0, 0),
            Coordinate(0.00005, 0),
            Coordinate(0.0001, 0),
            Coordinate(0.00015, 0),
            Coordinate(0.0002, 0),
        ]
        simplified = simplify_path(coords, tolerance=0.0001)
        # Should remove intermediate points
        assert len(simplified) <= len(coords)
        # Should keep first and last
        assert simplified[0] == coords[0]
        assert simplified[-1] == coords[-1]

    def test_simplify_path_requires_minimum_points(self):
        """Test simplifying path with fewer than 3 points."""
        coords = [Coordinate(0, 0), Coordinate(1, 1)]
        simplified = simplify_path(coords)
        assert simplified == coords
