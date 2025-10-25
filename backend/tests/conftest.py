"""Pytest configuration and fixtures for backend tests."""
import os
from pathlib import Path

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add src to path for imports
BACKEND_DIR = Path(__file__).parent.parent
SRC_DIR = BACKEND_DIR / "src"
os.sys.path.insert(0, str(SRC_DIR))


@pytest.fixture(scope="session")
def test_db_url():
    """Provide test database URL."""
    return "sqlite:///:memory:"


@pytest.fixture(scope="session")
def engine(test_db_url):
    """Create test database engine."""
    engine = create_engine(test_db_url, connect_args={"check_same_thread": False})
    return engine


@pytest.fixture(scope="session")
def SessionLocal(engine):
    """Create sessionmaker for test database."""
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db_session(SessionLocal):
    """Provide database session for test."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def cleanup_uploads(tmp_path):
    """Provide temporary directory for test uploads."""
    upload_dir = tmp_path / "uploads"
    upload_dir.mkdir()
    yield upload_dir
    # Cleanup happens automatically when tmp_path is destroyed
