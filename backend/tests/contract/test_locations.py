import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_locations_structure(client: AsyncClient):
    """Test that /locations endpoint returns correct structure."""
    response = await client.get("/api/v1/locations")
    
    # Should fail 404 before implementation
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
