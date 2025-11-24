"""Contract tests for flight stats endpoints."""
import pytest
from httpx import AsyncClient
from datetime import datetime

@pytest.mark.asyncio
async def test_get_flight_stats(client: AsyncClient, db_session):
    """Test getting flight statistics."""
    # Setup: Create some photos with GPS data
    from src.models.photo import Photo, PhotoMetadata
    from src.models.collection import Collection
    from sqlalchemy import delete
    
    # Clean up
    await db_session.execute(delete(Photo))
    await db_session.execute(delete(Collection))
    await db_session.commit()
    
    # Create a collection
    collection = Collection(name="Test Collection")
    db_session.add(collection)
    await db_session.flush() # Get ID

    # Flight 1: 2 photos, 100 meters apart, 1 minute apart
    photo1 = Photo(
        filename="f1_p1.jpg", 
        file_path="/tmp/f1_p1.jpg", 
        file_hash="h1",
        timestamp=datetime(2023, 1, 1, 10, 0, 0),
        file_size=1024,
        format="jpg",
        collection_id=collection.id
    )
    photo1.metadata_ = PhotoMetadata(
        latitude=10.0, 
        longitude=10.0, 
        altitude=100.0
    )
    
    photo2 = Photo(
        filename="f1_p2.jpg", 
        file_path="/tmp/f1_p2.jpg", 
        file_hash="h2",
        timestamp=datetime(2023, 1, 1, 10, 1, 0),
        file_size=1024,
        format="jpg",
        collection_id=collection.id
    )
    photo2.metadata_ = PhotoMetadata(
        latitude=10.001, 
        longitude=10.0, 
        altitude=100.0
    ) # Approx 111m lat diff

    db_session.add_all([photo1, photo2])
    await db_session.commit()

    # Using POST to support complex filters
    response = await client.post("/api/v1/flights/stats", json={})
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    stats = data["data"]
    
    assert "total_distance_meters" in stats
    assert "total_duration_seconds" in stats
    assert "total_photos" in stats
    
    assert stats["total_photos"] == 2
    assert stats["total_distance_meters"] > 0
    assert stats["total_duration_seconds"] == 60

@pytest.mark.asyncio
async def test_get_flight_stats_filtered(client: AsyncClient, db_session):
    """Test getting flight statistics with filters."""
    from src.models.photo import Photo, PhotoMetadata
    from src.models.collection import Collection
    from sqlalchemy import delete

    # Clean up
    await db_session.execute(delete(Photo))
    await db_session.execute(delete(Collection))
    await db_session.commit()

    # Create a collection
    collection = Collection(name="Test Collection 2")
    db_session.add(collection)
    await db_session.flush()

    # Date 1
    photo1 = Photo(
        filename="d1.jpg", 
        file_path="/tmp/d1.jpg", 
        file_hash="h3",
        timestamp=datetime(2023, 1, 1, 10, 0, 0),
        file_size=1024,
        format="jpg",
        collection_id=collection.id
    )
    photo1.metadata_ = PhotoMetadata(
        latitude=20.0, 
        longitude=20.0, 
        altitude=100.0
    )
    
    # Date 2
    photo2 = Photo(
        filename="d2.jpg", 
        file_path="/tmp/d2.jpg", 
        file_hash="h4",
        timestamp=datetime(2023, 2, 1, 10, 0, 0),
        file_size=1024,
        format="jpg",
        collection_id=collection.id
    )
    photo2.metadata_ = PhotoMetadata(
        latitude=20.0, 
        longitude=20.0, 
        altitude=100.0
    )

    db_session.add_all([photo1, photo2])
    await db_session.commit()

    # Filter for Jan 2023
    response = await client.post("/api/v1/flights/stats", json={
        "date_start": "2023-01-01T00:00:00",
        "date_end": "2023-01-31T23:59:59"
    })
    
    assert response.status_code == 200
    data = response.json()
    stats = data["data"]
    
    assert stats["total_photos"] == 1
