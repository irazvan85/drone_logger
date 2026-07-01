"""File system utilities for photo scanning and processing."""
import hashlib
import os
from pathlib import Path
from typing import Generator, List, Set

from src.exceptions import ValidationError

# Supported image extensions
IMAGE_EXTENSIONS: Set[str] = {".jpg", ".jpeg", ".png", ".tiff", ".tif", ".dng", ".raw"}


def scan_directory(directory_path: str | Path) -> Generator[Path, None, None]:
    """Recursively scan directory for supported image files.

    Args:
        directory_path: Path to directory to scan

    Yields:
        Path objects for found image files

    Raises:
        ValidationError: If directory does not exist or is not a directory
    """
    path = Path(directory_path)

    if not path.exists():
        raise ValidationError(f"Directory not found: {directory_path}")

    if not path.is_dir():
        raise ValidationError(f"Path is not a directory: {directory_path}")

    for root, _, files in os.walk(path):
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix.lower() in IMAGE_EXTENSIONS:
                yield file_path


def calculate_file_hash(file_path: str | Path, chunk_size: int = 8192) -> str:
    """Calculate SHA-256 hash of a file.

    Used for detecting duplicate files.

    Args:
        file_path: Path to file
        chunk_size: Size of chunks to read (default: 8KB)

    Returns:
        Hexadecimal hash string

    Raises:
        ValidationError: If file does not exist
    """
    path = Path(file_path)

    if not path.exists() or not path.is_file():
        raise ValidationError(f"File not found: {file_path}")

    sha256_hash = hashlib.sha256()

    with open(path, "rb") as f:
        for byte_block in iter(lambda: f.read(chunk_size), b""):
            sha256_hash.update(byte_block)

    return sha256_hash.hexdigest()


def validate_path(path_str: str, allowed_root: str | Path | None = None) -> Path:
    """Validate that a path string is safe and exists.

    Prevents path traversal attacks by resolving the path (following
    symlinks and ".." segments) and, when an allowed root is configured,
    rejecting paths outside it.

    Args:
        path_str: Path string to validate
        allowed_root: Optional directory the path must be inside

    Returns:
        Resolved Path object

    Raises:
        ValidationError: If path is invalid, does not exist, or is outside
            the allowed root
    """
    try:
        path = Path(path_str).resolve()
    except Exception as e:
        raise ValidationError(f"Invalid path format: {path_str}") from e

    if not path.exists():
        raise ValidationError(f"Path does not exist: {path_str}")

    if allowed_root is not None:
        root = Path(allowed_root).resolve()
        if root != path and root not in path.parents:
            raise ValidationError(f"Path is outside the allowed import directory: {path_str}")

    return path


def get_file_info(file_path: str | Path) -> dict:
    """Get basic file information.

    Args:
        file_path: Path to file

    Returns:
        Dictionary with file size, creation time, modification time
    """
    path = Path(file_path)
    stat = path.stat()

    return {
        "size": stat.st_size,
        "created_at": stat.st_ctime,
        "modified_at": stat.st_mtime,
        "extension": path.suffix.lower(),
        "filename": path.name,
    }
