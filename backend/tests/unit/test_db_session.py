"""Unit tests for database session management."""
import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import AsyncSessionLocal, get_db_session


@pytest.mark.asyncio
async def test_get_db_session():
    """Test that get_db_session provides an AsyncSession."""
    async for session in get_db_session():
        assert isinstance(session, AsyncSession)
        assert session.is_active
        break


@pytest.mark.asyncio
async def test_async_session_local_factory():
    """Test that AsyncSessionLocal creates valid sessions."""
    async with AsyncSessionLocal() as session:
        assert isinstance(session, AsyncSession)
        # Session is active during context manager
        assert session.is_active
