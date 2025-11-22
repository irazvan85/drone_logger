"""Service for processing photos."""
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Generator, Any

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from src.models.photo import Photo, PhotoMetadata
from src.services.gps_extractor import GPSExtractor
from src.services.collection_manager import CollectionManager
from src.utils.file_utils import scan_directory, get_file_info
from src.exceptions import InvalidGPSData

logger = logging.getLogger(__name__)


class PhotoProcessor:
    """Service for scanning and processing photos."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.gps_extractor = GPSExtractor()
        self.collection_manager = CollectionManager(session)

    def scan_folder(self, folder_path: Path) -> Generator[Path, None, None]:
        """Scan a folder for supported image files.

        Args:
            folder_path: Path to the folder

        Yields:
            Path objects for found images
        """
        return scan_directory(folder_path)

    async def process_folder(self, folder_path: Path, collection_id: str) -> Dict[str, Any]:
        """Process all photos in a folder.

        Args:
            folder_path: Path to the folder
            collection_id: ID of the collection to add photos to

        Returns:
            Dictionary with import statistics
        """
        # Verify collection exists
        await self.collection_manager.get_collection(collection_id)

        files = list(self.scan_folder(folder_path))
        return await self.process_photos(files, collection_id)

    async def process_photos(self, files: List[Path], collection_id: str) -> Dict[str, Any]:
        """Process a list of photo files.

        Args:
            files: List of file paths
            collection_id: ID of the collection

        Returns:
            Dictionary with import statistics
        """
        stats = {
            "total_scanned": len(files),
            "total_imported": 0,
            "successful": 0,
            "failed": 0,
            "errors": []
        }

        for file_path in files:
            try:
                await self._process_single_photo(file_path, collection_id)
                stats["successful"] += 1
                stats["total_imported"] += 1
            except Exception as e:
                stats["failed"] += 1
                error_msg = f"Failed to process {file_path.name}: {str(e)}"
                stats["errors"].append(error_msg)
                logger.warning(error_msg)

        # Update collection count
        if stats["successful"] > 0:
            await self.collection_manager.update_photo_count(collection_id, stats["successful"])

        return stats

    async def _process_single_photo(self, file_path: Path, collection_id: str) -> Photo:
        """Process a single photo file.

        Args:
            file_path: Path to the file
            collection_id: ID of the collection

        Returns:
            Created Photo object

        Raises:
            Exception: If processing fails
        """
        # 1. Extract file info
        file_info = get_file_info(file_path)
        
        # 2. Extract GPS data
        # We extract GPS data first to fail early if it's missing/invalid
        # (per requirements, we only want photos with GPS data)
        try:
            metadata_obj = self.gps_extractor.extract(file_path)
        except InvalidGPSData:
            # For MVP, we might want to skip photos without GPS
            # Or we could import them without metadata.
            # Spec says: "System MUST skip the photo and log a warning"
            raise

        # 3. Create Photo record
        # Use EXIF timestamp if available, else file creation time
        # For now using file creation time as simple fallback
        # TODO: Extract timestamp from EXIF
        timestamp = datetime.fromtimestamp(file_info["created_at"])

        photo = Photo(
            filename=file_info["filename"],
            file_path=str(file_path),
            timestamp=timestamp,
            file_size=file_info["size"],
            format=file_info["extension"].lstrip("."),
            collection_id=collection_id
        )

        self.session.add(photo)
        
        try:
            await self.session.flush()  # Get ID for photo
        except IntegrityError:
            await self.session.rollback()
            raise Exception("Photo already exists in database")

        # 4. Create Metadata record
        metadata_obj.photo_id = photo.id
        self.session.add(metadata_obj)
        
        await self.session.commit()
        
        return photo
