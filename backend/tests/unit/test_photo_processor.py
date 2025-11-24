"""Unit tests for photo processor service."""
import pytest
from pathlib import Path
from unittest.mock import Mock, patch, AsyncMock

from src.services.photo_processor import PhotoProcessor
from src.models.photo import Photo, PhotoMetadata


@pytest.fixture
def photo_processor(db_session):
    return PhotoProcessor(db_session)


@pytest.mark.asyncio
async def test_scan_folder(photo_processor, tmp_path):
    """Test scanning a folder for images."""
    # Create dummy files
    (tmp_path / "photo1.jpg").touch()
    (tmp_path / "photo2.PNG").touch()
    (tmp_path / "text.txt").touch()
    
    files = list(photo_processor.scan_folder(tmp_path))
    
    assert len(files) == 2
    assert any(f.name == "photo1.jpg" for f in files)
    assert any(f.name == "photo2.PNG" for f in files)


@pytest.mark.asyncio
async def test_process_photos(photo_processor, tmp_path):
    """Test processing photos and saving to DB."""
    # Mock CollectionManager
    photo_processor.collection_manager = AsyncMock()
    
    # Mock GPS extractor
    with patch("src.services.gps_extractor.GPSExtractor.extract") as mock_extract:
        mock_extract.return_value = PhotoMetadata(
            latitude=37.0, longitude=-122.0, altitude=50.0,
            camera_model="Drone", iso=100, shutter_speed="1/100", aperture="f/2.8"
        )
        
        # Create a test file
        photo_path = tmp_path / "test.jpg"
        photo_path.write_text("some content")
        
        result = await photo_processor.process_photos(
            [photo_path], collection_id="test-col-id"
        )
        
        assert result["successful"] == 1
        assert result["failed"] == 0
        
        # Verify DB insertion (mocked session)
        # In a real unit test with DB, we'd query the DB


@pytest.mark.asyncio
async def test_process_photos_preserves_files(photo_processor, tmp_path):
    """Test that processing photos does not modify the original files."""
    # Mock CollectionManager
    photo_processor.collection_manager = AsyncMock()
    
    # Mock GPS extractor
    with patch("src.services.gps_extractor.GPSExtractor.extract") as mock_extract:
        mock_extract.return_value = PhotoMetadata(
            latitude=37.0, longitude=-122.0, altitude=50.0,
            camera_model="Drone", iso=100, shutter_speed="1/100", aperture="f/2.8"
        )
        
        # Create a test file
        photo_path = tmp_path / "test_preserve.jpg"
        content = b"original content"
        photo_path.write_bytes(content)
        
        # Get initial stats
        initial_stat = photo_path.stat()
        initial_mtime = initial_stat.st_mtime
        
        # Process the photo
        await photo_processor.process_photos(
            [photo_path], collection_id="test-col-id"
        )
        
        # Verify content is unchanged
        assert photo_path.read_bytes() == content
        
        # Verify modification time is unchanged
        # Note: In some fast executions, mtime might not change even if written, 
        # but content check is the most important.
        # We can also check that we didn't open it in write mode, but that's hard to test directly without mocking open.
        # Content check is sufficient.
        assert photo_path.stat().st_mtime == initial_mtime


@pytest.mark.asyncio
async def test_process_photos_duplicate(photo_processor, tmp_path):
    """Test duplicate photo detection."""
    # Mock CollectionManager
    photo_processor.collection_manager = AsyncMock()
    
    # Mock GPS extractor
    with patch("src.services.gps_extractor.GPSExtractor.extract") as mock_extract:
        mock_extract.return_value = PhotoMetadata(
            latitude=37.0, longitude=-122.0, altitude=50.0,
            camera_model="Drone", iso=100, shutter_speed="1/100", aperture="f/2.8"
        )
        
        # Create a test file
        photo_path = tmp_path / "test_dup.jpg"
        photo_path.write_bytes(b"duplicate content")
        
        # Process first time
        result1 = await photo_processor.process_photos(
            [photo_path], collection_id="test-col-id"
        )
        assert result1["successful"] == 1
        
        # Process second time (different path, same content -> same hash)
        photo_path2 = tmp_path / "test_dup_2.jpg"
        photo_path2.write_bytes(b"duplicate content")
        
        result2 = await photo_processor.process_photos(
            [photo_path2], collection_id="test-col-id"
        )
        
        assert result2["successful"] == 0
        assert result2["duplicates"] == 1
