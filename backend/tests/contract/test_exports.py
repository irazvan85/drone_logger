"""Contract tests for export endpoints."""
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_export_photos(client: AsyncClient):
    """Test exporting photos."""
    payload = {
        "format": "geojson",
        "photo_ids": ["some-id"]
    }
    
    response = await client.post("/api/v1/exports", json=payload)
    
    # Should fail initially as endpoint doesn't exist
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/geo+json"
