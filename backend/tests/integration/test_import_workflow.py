"""Integration tests for import workflow."""
import pytest
from pathlib import Path
from unittest.mock import patch, Mock

from src.services.photo_processor import PhotoProcessor
from src.services.collection_manager import CollectionManager
from src.models.photo import PhotoMetadata


@pytest.mark.asyncio
async def test_import_workflow(db_session, tmp_path):
    """Test full import workflow: create collection -> scan -> extract -> store."""
    
    # 1. Create Collection
    col_manager = CollectionManager(db_session)
    collection = await col_manager.create_collection(
        name="Integration Test Flight",
        description="Testing full workflow"
    )
    assert collection.id is not None
    
    # 2. Setup Test Photos
    photo_dir = tmp_path / "photos"
    photo_dir.mkdir()
    (photo_dir / "img1.jpg").touch()
    (photo_dir / "img2.jpg").touch()
    
    # 3. Process Photos (Mock GPS extraction to avoid needing real EXIF data)
    processor = PhotoProcessor(db_session)
    
    with patch("src.services.gps_extractor.GPSExtractor.extract") as mock_extract:
        mock_extract.return_value = PhotoMetadata(
            latitude=37.5, longitude=-122.5, altitude=100.0
        )
        
        result = await processor.process_folder(
            folder_path=photo_dir,
            collection_id=collection.id
        )
        
        assert result["total_imported"] == 2
        assert result["successful"] == 2
        
    # 4. Verify Data in DB
    # Re-fetch collection with photos
    from sqlalchemy import select
    from sqlalchemy.orm import selectinload
    from src.models.collection import Collection
    
    query = select(Collection).options(selectinload(Collection.photos)).where(Collection.id == collection.id)
    result = await db_session.execute(query)
    updated_col = result.scalar_one()
    
    assert len(updated_col.photos) == 2
    assert updated_col.total_photos == 2
