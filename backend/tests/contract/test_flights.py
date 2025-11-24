"""Contract tests for flight stats endpoints."""
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_flight_stats(client: AsyncClient):
    """Test getting flight statistics."""
    # Using POST to support complex filters
    response = await client.post("/api/v1/flights/stats", json={})
    
    assert response.status_code == 200
    data = response.json()
    # APIResponse wraps data in "data" field
    assert "data" in data
    stats = data["data"]
    assert "total_distance_meters" in stats
    assert "total_photos" in stats
    assert "date_start" in stats
    assert "date_end" in stats
