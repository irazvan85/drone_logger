"""Collection endpoints."""
from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db_session
from src.schemas.base import APIResponse
from src.schemas.collection import CollectionCreate, CollectionResponse
from src.services.collection_manager import CollectionManager

router = APIRouter()


@router.post("/", response_model=APIResponse[CollectionResponse], status_code=status.HTTP_201_CREATED)
async def create_collection(
    collection_in: CollectionCreate,
    db: AsyncSession = Depends(get_db_session)
) -> APIResponse[CollectionResponse]:
    """Create a new collection."""
    manager = CollectionManager(db)
    collection = await manager.create_collection(
        name=collection_in.name,
        description=collection_in.description
    )
    return APIResponse(data=collection)


@router.get("/", response_model=APIResponse[List[CollectionResponse]])
async def list_collections(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db_session)
) -> APIResponse[List[CollectionResponse]]:
    """List all collections."""
    manager = CollectionManager(db)
    collections = await manager.list_collections(skip=skip, limit=limit)
    return APIResponse(data=collections)


@router.get("/{collection_id}", response_model=APIResponse[CollectionResponse])
async def get_collection(
    collection_id: str,
    db: AsyncSession = Depends(get_db_session)
) -> APIResponse[CollectionResponse]:
    """Get a specific collection."""
    manager = CollectionManager(db)
    collection = await manager.get_collection(collection_id)
    return APIResponse(data=collection)
