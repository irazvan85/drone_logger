import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.gps_location import GPSLocation
from src.models.photo_marker import PhotoMarker

@pytest.mark.asyncio
async def test_map_display_workflow(client: AsyncClient, db_session: AsyncSession):
    """Test fetching locations for map display."""
    # 1. Seed database with some locations
    loc1 = GPSLocation(latitude=40.7128, longitude=-74.0060, altitude=10.0)
    loc2 = GPSLocation(latitude=34.0522, longitude=-118.2437, altitude=20.0)
    db_session.add_all([loc1, loc2])
    await db_session.commit()
    await db_session.refresh(loc1)
    await db_session.refresh(loc2)

    # 2. Create markers linked to locations
    marker1 = PhotoMarker(location_id=loc1.id, photos_count=5)
    marker2 = PhotoMarker(location_id=loc2.id, photos_count=3)
    db_session.add_all([marker1, marker2])
    await db_session.commit()

    # 3. Fetch locations via API
    response = await client.get("/api/v1/locations")
    assert response.status_code == 200
    data = response.json()

    # 4. Verify data
    assert len(data) == 2
    
    # Check first location (order might vary, so find by lat)
    ny_loc = next((l for l in data if abs(l["location"]["latitude"] - 40.7128) < 0.0001), None)
    assert ny_loc is not None
    assert ny_loc["location"]["longitude"] == -74.0060
    assert ny_loc["photos_count"] == 5
