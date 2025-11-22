"""Unit tests for GPS extraction service."""
import pytest
from pathlib import Path
from unittest.mock import patch, MagicMock

from src.services.gps_extractor import GPSExtractor
from src.exceptions import InvalidGPSData


@pytest.fixture
def gps_extractor():
    return GPSExtractor()


def test_extract_gps_data_success(gps_extractor):
    """Test successful GPS extraction from a valid photo."""
    # Mock piexif.load to return sample EXIF data
    with patch("piexif.load") as mock_load:
        # Sample EXIF data structure (simplified)
        mock_load.return_value = {
            "GPS": {
                1: b'N',
                2: ((37, 1), (46, 1), (30, 1)),  # 37 deg 46' 30" N
                3: b'W',
                4: ((122, 1), (25, 1), (10, 1)), # 122 deg 25' 10" W
                6: (100, 1)  # Altitude 100m
            }
        }
        
        metadata = gps_extractor.extract(Path("test.jpg"))
        
        assert metadata.latitude == pytest.approx(37.775, 0.001)
        assert metadata.longitude == pytest.approx(-122.419, 0.001)
        assert metadata.altitude == 100.0


def test_extract_gps_data_no_exif(gps_extractor):
    """Test handling of photos with no EXIF data."""
    with patch("piexif.load") as mock_load:
        mock_load.return_value = {}
        
        with pytest.raises(InvalidGPSData):
            gps_extractor.extract(Path("no_exif.jpg"))


def test_extract_gps_data_invalid_coords(gps_extractor):
    """Test handling of invalid GPS coordinates."""
    with patch("piexif.load") as mock_load:
        mock_load.return_value = {
            "GPS": {
                1: b'N',
                2: ((999, 1), (0, 1), (0, 1)),  # Invalid latitude
                3: b'W',
                4: ((0, 1), (0, 1), (0, 1))
            }
        }
        
        with pytest.raises(InvalidGPSData):
            gps_extractor.extract(Path("invalid.jpg"))
