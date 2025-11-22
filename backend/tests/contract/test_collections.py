"""Contract tests for collection endpoints."""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_collection(client: AsyncClient):
    """Test creating a new collection."""
    payload = {
        "name": "Test Flight 2023",
        "description": "Photos from the park"
    }
    
    response = await client.post("/api/v1/collections/", json=payload)
    
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["name"] == payload["name"]
    assert "id" in data["data"]
    assert "created_at" in data["data"]


@pytest.mark.asyncio
async def test_get_collections(client: AsyncClient):
    """Test listing collections."""
    # Create a collection first
    await client.post("/api/v1/collections/", json={"name": "Collection 1"})
    
    response = await client.get("/api/v1/collections/")
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
    assert len(data["data"]) >= 1


@pytest.mark.asyncio
async def test_get_collection_by_id(client: AsyncClient):
    """Test getting a specific collection."""
    # Create
    create_res = await client.post("/api/v1/collections/", json={"name": "Specific Collection"})
    collection_id = create_res.json()["data"]["id"]
    
    # Get
    response = await client.get(f"/api/v1/collections/{collection_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["id"] == collection_id
    assert data["data"]["name"] == "Specific Collection"
