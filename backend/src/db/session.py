"""Database session and connection management."""
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

# Database URL from environment or use default SQLite
DATABASE_URL = "sqlite+aiosqlite:///./app.db"

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL debugging
    future=True,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """Get database session for dependency injection.

    Yields:
        AsyncSession: Database session for the request

    Example:
        async def get_photos(db: AsyncSession = Depends(get_db_session)):
            photos = await db.execute(select(Photo))
            return photos.scalars().all()
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db() -> None:
    """Initialize database tables.

    Creates all tables defined in SQLAlchemy models.
    This should be called on application startup.
    """
    from src.models.base import Base

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def dispose_db() -> None:
    """Dispose of database connections.

    This should be called on application shutdown.
    """
    await engine.dispose()
