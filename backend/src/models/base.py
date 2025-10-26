"""Base SQLAlchemy model with common fields."""
from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models.

    This is the declarative registry that all models inherit from.
    """

    pass


class BaseModel(Base):
    """Base model with common fields for all entities.

    Provides common fields like ID, created_at, and updated_at to all models.

    Attributes:
        id: UUID primary key
        created_at: Timestamp when record was created (UTC)
        updated_at: Timestamp when record was last updated (UTC)
    """

    __abstract__ = True

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid4()), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
