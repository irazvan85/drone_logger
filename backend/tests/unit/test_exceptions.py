"""Unit tests for custom exception classes."""
import pytest

from src.exceptions import (
    AppException,
    ConflictError,
    ForbiddenError,
    NotFoundError,
    ProcessingError,
    UnauthorizedError,
    ValidationError,
)


def test_app_exception():
    """Test AppException creation and attributes."""
    exc = AppException("Test error", status_code=400, error_code="TEST_ERROR")
    assert exc.message == "Test error"
    assert exc.status_code == 400
    assert exc.error_code == "TEST_ERROR"


def test_validation_error():
    """Test ValidationError creates correct status code."""
    exc = ValidationError("Invalid input")
    assert exc.status_code == 400
    assert exc.error_code == "VALIDATION_ERROR"


def test_not_found_error():
    """Test NotFoundError creates correct status code."""
    exc = NotFoundError("Resource not found")
    assert exc.status_code == 404
    assert exc.error_code == "NOT_FOUND"


def test_conflict_error():
    """Test ConflictError creates correct status code."""
    exc = ConflictError("Duplicate resource")
    assert exc.status_code == 409
    assert exc.error_code == "CONFLICT"


def test_unauthorized_error():
    """Test UnauthorizedError creates correct status code."""
    exc = UnauthorizedError()
    assert exc.status_code == 401
    assert exc.error_code == "UNAUTHORIZED"


def test_forbidden_error():
    """Test ForbiddenError creates correct status code."""
    exc = ForbiddenError()
    assert exc.status_code == 403
    assert exc.error_code == "FORBIDDEN"


def test_processing_error():
    """Test ProcessingError creates correct status code."""
    exc = ProcessingError("Failed to process")
    assert exc.status_code == 422
    assert exc.error_code == "PROCESSING_ERROR"
