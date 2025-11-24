import pytest
from datetime import datetime
from unittest.mock import Mock
from src.services.flight_service import FlightService
from src.models.photo import Photo, PhotoMetadata

@pytest.fixture
def flight_service():
    return FlightService()

def test_calculate_stats_empty(flight_service):
    stats = flight_service.calculate_stats([])
    assert stats["total_distance_meters"] == 0
    assert stats["total_photos"] == 0
    assert stats["date_start"] is None
    assert stats["date_end"] is None

def test_calculate_stats_single_photo(flight_service):
    photo = Mock(spec=Photo)
    photo.metadata_ = Mock(spec=PhotoMetadata)
    photo.metadata_.latitude = 10.0
    photo.metadata_.longitude = 20.0
    photo.timestamp = datetime(2023, 1, 1, 10, 0, 0)
    
    stats = flight_service.calculate_stats([photo])
    assert stats["total_distance_meters"] == 0
    assert stats["total_photos"] == 1
    assert stats["date_start"] == photo.timestamp
    assert stats["date_end"] == photo.timestamp

def test_calculate_stats_multiple_photos(flight_service):
    # Create 3 photos in a line
    # Point 1: (0, 0)
    # Point 2: (0, 1) -> approx 111km
    # Point 3: (0, 2) -> approx 111km
    
    p1 = Mock(spec=Photo)
    p1.metadata_ = Mock(spec=PhotoMetadata)
    p1.metadata_.latitude = 0.0
    p1.metadata_.longitude = 0.0
    p1.timestamp = datetime(2023, 1, 1, 10, 0, 0)
    
    p2 = Mock(spec=Photo)
    p2.metadata_ = Mock(spec=PhotoMetadata)
    p2.metadata_.latitude = 0.0
    p2.metadata_.longitude = 1.0
    p2.timestamp = datetime(2023, 1, 1, 10, 1, 0)
    
    p3 = Mock(spec=Photo)
    p3.metadata_ = Mock(spec=PhotoMetadata)
    p3.metadata_.latitude = 0.0
    p3.metadata_.longitude = 2.0
    p3.timestamp = datetime(2023, 1, 1, 10, 2, 0)
    
    stats = flight_service.calculate_stats([p1, p3, p2]) # Unsorted input
    
    assert stats["total_photos"] == 3
    assert stats["date_start"] == p1.timestamp
    assert stats["date_end"] == p3.timestamp
    
    # Distance should be approx 222km = 222000m
    # Allow some margin for calculation differences
    assert stats["total_distance_meters"] > 200000
    assert stats["total_distance_meters"] < 250000
