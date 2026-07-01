"""Unit tests for file system utilities."""
import pytest

from src.exceptions import ValidationError
from src.utils.file_utils import validate_path


def test_validate_path_existing_dir(tmp_path):
    """A valid existing path resolves successfully."""
    result = validate_path(str(tmp_path))
    assert result == tmp_path.resolve()


def test_validate_path_missing(tmp_path):
    """A non-existent path raises ValidationError."""
    with pytest.raises(ValidationError):
        validate_path(str(tmp_path / "does-not-exist"))


def test_validate_path_inside_allowed_root(tmp_path):
    """Paths inside the allowed root are accepted."""
    subdir = tmp_path / "photos" / "flight1"
    subdir.mkdir(parents=True)

    result = validate_path(str(subdir), allowed_root=str(tmp_path / "photos"))
    assert result == subdir.resolve()


def test_validate_path_root_itself_allowed(tmp_path):
    """The allowed root itself is a valid import path."""
    result = validate_path(str(tmp_path), allowed_root=str(tmp_path))
    assert result == tmp_path.resolve()


def test_validate_path_outside_allowed_root(tmp_path):
    """Paths outside the allowed root are rejected."""
    outside = tmp_path / "elsewhere"
    outside.mkdir()
    root = tmp_path / "photos"
    root.mkdir()

    with pytest.raises(ValidationError):
        validate_path(str(outside), allowed_root=str(root))


def test_validate_path_traversal_out_of_root(tmp_path):
    """".." segments cannot escape the allowed root."""
    root = tmp_path / "photos"
    root.mkdir()

    with pytest.raises(ValidationError):
        validate_path(str(root / ".." / ".."), allowed_root=str(root))
