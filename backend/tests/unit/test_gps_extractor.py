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


def test_extract_timestamp_from_datetime_original(gps_extractor):
    """DateTimeOriginal is parsed into a datetime."""
    import piexif
    from datetime import datetime

    with patch("piexif.load") as mock_load:
        mock_load.return_value = {
            "Exif": {piexif.ExifIFD.DateTimeOriginal: b"2023:06:15 14:30:00"}
        }

        result = gps_extractor.extract_timestamp(Path("test.jpg"))

        assert result == datetime(2023, 6, 15, 14, 30, 0)


def test_extract_timestamp_falls_back_to_ifd0_datetime(gps_extractor):
    """The 0th IFD DateTime tag is used when Exif tags are missing."""
    import piexif
    from datetime import datetime

    with patch("piexif.load") as mock_load:
        mock_load.return_value = {
            "0th": {piexif.ImageIFD.DateTime: b"2022:01:02 03:04:05"}
        }

        result = gps_extractor.extract_timestamp(Path("test.jpg"))

        assert result == datetime(2022, 1, 2, 3, 4, 5)


def test_extract_timestamp_missing_returns_none(gps_extractor):
    """Missing or unreadable EXIF timestamps return None."""
    with patch("piexif.load") as mock_load:
        mock_load.return_value = {}
        assert gps_extractor.extract_timestamp(Path("test.jpg")) is None

    with patch("piexif.load") as mock_load:
        mock_load.side_effect = Exception("not an image")
        assert gps_extractor.extract_timestamp(Path("test.txt")) is None
