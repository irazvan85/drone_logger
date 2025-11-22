"""Service for managing photo collections."""
import logging
from typing import List, Optional

from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.collection import Collection
from src.exceptions import NotFoundError

logger = logging.getLogger(__name__)


class CollectionManager:
    """Service for managing collections."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_collection(self, name: str, description: Optional[str] = None) -> Collection:
        """Create a new collection.

        Args:
            name: Name of the collection
            description: Optional description

        Returns:
            Created Collection object
        """
        collection = Collection(name=name, description=description)
        self.session.add(collection)
        await self.session.commit()
        await self.session.refresh(collection)
        logger.info(f"Created collection: {collection.name} ({collection.id})")
        return collection

    async def get_collection(self, collection_id: str) -> Collection:
        """Get a collection by ID.

        Args:
            collection_id: UUID of the collection

        Returns:
            Collection object

        Raises:
            NotFoundError: If collection does not exist
        """
        query = select(Collection).where(Collection.id == collection_id)
        result = await self.session.execute(query)
        collection = result.scalar_one_or_none()

        if not collection:
            raise NotFoundError(f"Collection not found: {collection_id}")

        return collection

    async def list_collections(
        self, skip: int = 0, limit: int = 100
    ) -> List[Collection]:
        """List collections with pagination.

        Args:
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            List of Collection objects
        """
        query = (
            select(Collection)
            .order_by(desc(Collection.created_at))
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def update_photo_count(self, collection_id: str, count: int) -> None:
        """Update the total photo count for a collection.

        Args:
            collection_id: UUID of the collection
            count: Number of photos to add to the count
        """
        collection = await self.get_collection(collection_id)
        collection.total_photos += count
        await self.session.commit()
