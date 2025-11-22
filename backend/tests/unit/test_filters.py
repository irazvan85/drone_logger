"""Unit tests for filter utilities."""
import pytest
from datetime import datetime
from unittest.mock import MagicMock

from src.models.photo import Photo, PhotoMetadata
from src.utils.filters import filter_by_date_range, filter_by_bounds

@pytest.fixture
def sample_photos():
    """Create sample photos for testing."""
    p1 = MagicMock(spec=Photo)
    p1.timestamp = datetime(2023, 1, 15, 10, 0, 0)
    p1.metadata_ = MagicMock(spec=PhotoMetadata)
    p1.metadata_.latitude = 44.5
    p1.metadata_.longitude = -122.5

    p2 = MagicMock(spec=Photo)
    p2.timestamp = datetime(2023, 6, 15, 10, 0, 0)
    p2.metadata_ = MagicMock(spec=PhotoMetadata)
    p2.metadata_.latitude = 45.5
    p2.metadata_.longitude = -121.5

    p3 = MagicMock(spec=Photo)
    p3.timestamp = datetime(2022, 12, 31, 23, 59, 59)
    p3.metadata_ = MagicMock(spec=PhotoMetadata)
    p3.metadata_.latitude = 44.5
    p3.metadata_.longitude = -122.5

    return [p1, p2, p3]

def test_filter_by_date_range(sample_photos):
    """Test filtering by date range."""
    start = datetime(2023, 1, 1)
    end = datetime(2023, 12, 31)
    
    filtered = filter_by_date_range(sample_photos, start, end)
    
    assert len(filtered) == 2
    assert sample_photos[0] in filtered
    assert sample_photos[1] in filtered
    assert sample_photos[2] not in filtered

def test_filter_by_bounds(sample_photos):
    """Test filtering by geographic bounds."""
    # Bounds covering p1 only
    bounds = {
        "north": 45.0,
        "south": 44.0,
        "east": -122.0,
        "west": -123.0
    }
    
    filtered = filter_by_bounds(sample_photos, bounds)
    
    assert len(filtered) == 2 # p1 and p3 are at same location
    assert sample_photos[0] in filtered
    assert sample_photos[2] in filtered
    assert sample_photos[1] not in filtered
