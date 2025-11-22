"""Database initialization script."""
import asyncio
import logging
import sys
from pathlib import Path

# Add project root to python path
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.config import setup_logging
from src.db.session import init_db

logger = logging.getLogger(__name__)


async def main() -> None:
    """Initialize database."""
    setup_logging()
    logger.info("Creating initial database tables...")
    
    try:
        await init_db()
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
