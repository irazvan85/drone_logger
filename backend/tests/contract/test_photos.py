"""Contract tests for photo endpoints."""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_import_photos(client: AsyncClient, cleanup_uploads):
    """Test importing photos from a folder."""
    # First create a collection
    col_res = await client.post("/api/v1/collections/", json={"name": "Import Test"})
    collection_id = col_res.json()["data"]["id"]
    
    payload = {
        "folder_path": str(cleanup_uploads),
        "collection_id": collection_id
    }
    
    response = await client.post("/api/v1/photos/import", json=payload)
    
    # Should fail initially as endpoint doesn't exist
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "total_imported" in data["data"]
    assert data["data"]["total_imported"] == 0  # Should be 0 as folder is empty

@pytest.mark.asyncio
async def test_list_photos(client: AsyncClient):
    """Test listing photos."""
    response = await client.get("/api/v1/photos/")
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)


@pytest.mark.asyncio
async def test_filter_photos(client: AsyncClient):
    """Test filtering photos."""
    payload = {
        "date_start": "2023-01-01T00:00:00",
        "date_end": "2023-12-31T23:59:59",
        "bounds": {
            "north": 45.0,
            "south": 44.0,
            "east": -122.0,
            "west": -123.0
        }
    }
    
    response = await client.post("/api/v1/photos/filter", json=payload)
    
    # Should fail initially as endpoint doesn't exist
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
