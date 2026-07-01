"""Unit tests for export service."""
import pytest
from unittest.mock import MagicMock
from datetime import datetime
from src.models.photo import Photo, PhotoMetadata
from src.services.export_service import ExportService

@pytest.fixture
def sample_photos():
    """Create sample photos for testing."""
    p1 = MagicMock(spec=Photo)
    p1.id = "1"
    p1.filename = "photo1.jpg"
    p1.timestamp = datetime(2023, 1, 15, 10, 0, 0)
    p1.metadata_ = MagicMock(spec=PhotoMetadata)
    p1.metadata_.latitude = 45.0
    p1.metadata_.longitude = -122.0
    p1.metadata_.altitude = 100.0

    p2 = MagicMock(spec=Photo)
    p2.id = "2"
    p2.filename = "photo2.jpg"
    p2.timestamp = datetime(2023, 1, 15, 11, 0, 0)
    p2.metadata_ = MagicMock(spec=PhotoMetadata)
    p2.metadata_.latitude = 45.1
    p2.metadata_.longitude = -122.1
    p2.metadata_.altitude = 150.0

    return [p1, p2]

def test_export_to_geojson(sample_photos):
    """Test GeoJSON export."""
    service = ExportService()
    result = service.export_to_geojson(sample_photos)
    
    assert result["type"] == "FeatureCollection"
    assert len(result["features"]) == 2
    assert result["features"][0]["geometry"]["coordinates"] == [-122.0, 45.0, 100.0]
    assert result["features"][0]["properties"]["filename"] == "photo1.jpg"

def test_export_to_csv(sample_photos):
    """Test CSV export."""
    service = ExportService()
    result = service.export_to_csv(sample_photos)
    
    lines = result.strip().split('\n')
    assert len(lines) == 3  # Header + 2 rows
    assert "filename,latitude,longitude,altitude,timestamp" in lines[0]
    assert "photo1.jpg,45.0,-122.0,100.0" in lines[1]

def test_export_to_kml(sample_photos):
    """Test KML export."""
    service = ExportService()
    result = service.export_to_kml(sample_photos)

    assert "<?xml" in result
    assert "<kml" in result
    assert "<Placemark>" in result
    assert "photo1.jpg" in result
    assert "-122.0,45.0,100.0" in result


def test_export_to_kml_escapes_filename(sample_photos):
    """Filenames with XML special characters are escaped in KML output."""
    sample_photos[0].filename = "a<b>&photo.jpg"

    service = ExportService()
    result = service.export_to_kml(sample_photos)

    assert "a&lt;b&gt;&amp;photo.jpg" in result
    assert "<name>a<b>" not in result


def test_export_handles_missing_altitude(sample_photos):
    """Photos without altitude export cleanly in all formats."""
    sample_photos[0].metadata_.altitude = None

    service = ExportService()

    geojson = service.export_to_geojson(sample_photos)
    assert geojson["features"][0]["geometry"]["coordinates"] == [-122.0, 45.0]

    csv_out = service.export_to_csv(sample_photos)
    assert "None" not in csv_out

    kml = service.export_to_kml(sample_photos)
    assert "-122.0,45.0</coordinates>" in kml
    assert "None" not in kml
