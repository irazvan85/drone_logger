"""Base service class providing common database operations."""
from typing import Any, Generic, TypeVar, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.exceptions import NotFoundError
from src.models.base import BaseModel

ModelT = TypeVar("ModelT", bound=BaseModel)
CreateSchemaT = TypeVar("CreateSchemaT")
UpdateSchemaT = TypeVar("UpdateSchemaT")


class BaseService(Generic[ModelT, CreateSchemaT, UpdateSchemaT]):
    """Base service class with common CRUD operations.

    This class provides a foundation for all services with async database operations.
    Services should inherit from this and override methods as needed.

    Type Parameters:
        ModelT: SQLAlchemy model class
        CreateSchemaT: Pydantic schema for create operations
        UpdateSchemaT: Pydantic schema for update operations
    """

    def __init__(self, model: type[ModelT], db_session: AsyncSession):
        """Initialize base service.

        Args:
            model: SQLAlchemy model class
            db_session: Async database session

        Example:
            class PhotoService(BaseService[Photo, PhotoCreate, PhotoUpdate]):
                pass

            photo_service = PhotoService(Photo, db_session)
        """
        self.model = model
        self.db = db_session

    async def get_by_id(self, item_id: str) -> Optional[ModelT]:
        """Get single item by ID.

        Args:
            item_id: ID of item to retrieve

        Returns:
            Model instance or None if not found
        """
        query = select(self.model).where(self.model.id == item_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_id_or_raise(self, item_id: str) -> ModelT:
        """Get single item by ID or raise NotFoundError.

        Args:
            item_id: ID of item to retrieve

        Returns:
            Model instance

        Raises:
            NotFoundError: If item not found
        """
        item = await self.get_by_id(item_id)
        if not item:
            raise NotFoundError(f"{self.model.__name__} with ID {item_id} not found")
        return item

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[ModelT]:
        """Get all items with pagination.

        Args:
            skip: Number of items to skip (default: 0)
            limit: Maximum items to return (default: 100)

        Returns:
            List of model instances
        """
        query = select(self.model).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create(self, obj_in: CreateSchemaT) -> ModelT:
        """Create new item.

        Args:
            obj_in: Schema with item data

        Returns:
            Created model instance
        """
        db_obj = self.model(**obj_in.dict())
        self.db.add(db_obj)
        await self.db.flush()
        await self.db.refresh(db_obj)
        return db_obj

    async def update(self, db_obj: ModelT, obj_in: UpdateSchemaT) -> ModelT:
        """Update existing item.

        Args:
            db_obj: Model instance to update
            obj_in: Schema with update data

        Returns:
            Updated model instance
        """
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)

        self.db.add(db_obj)
        await self.db.flush()
        await self.db.refresh(db_obj)
        return db_obj

    async def delete(self, db_obj: ModelT) -> ModelT:
        """Delete item.

        Args:
            db_obj: Model instance to delete

        Returns:
            Deleted model instance
        """
        await self.db.delete(db_obj)
        await self.db.flush()
        return db_obj

    async def delete_by_id(self, item_id: str) -> bool:
        """Delete item by ID.

        Args:
            item_id: ID of item to delete

        Returns:
            True if item was deleted, False if not found
        """
        item = await self.get_by_id(item_id)
        if not item:
            return False
        await self.delete(item)
        return True

    async def count(self) -> int:
        """Get total count of items.

        Returns:
            Total number of items in table
        """
        query = select(self.model)
        result = await self.db.execute(query)
        return len(result.scalars().all())

    async def commit(self) -> None:
        """Commit database transaction.

        Use this after making multiple operations.
        """
        await self.db.commit()

    async def rollback(self) -> None:
        """Rollback database transaction."""
        await self.db.rollback()
