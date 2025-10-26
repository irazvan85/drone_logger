"""Custom exception classes for the application."""


class AppException(Exception):
    """Base exception for all application errors."""

    def __init__(self, message: str, status_code: int = 500, error_code: str = "INTERNAL_ERROR"):
        """Initialize application exception.

        Args:
            message: Human-readable error message
            status_code: HTTP status code (default: 500)
            error_code: Machine-readable error code (default: INTERNAL_ERROR)
        """
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        super().__init__(self.message)


class ValidationError(AppException):
    """Raised when input validation fails."""

    def __init__(self, message: str, error_code: str = "VALIDATION_ERROR"):
        """Initialize validation error.

        Args:
            message: Description of validation failure
            error_code: Machine-readable error code
        """
        super().__init__(message, status_code=400, error_code=error_code)


class NotFoundError(AppException):
    """Raised when a requested resource is not found."""

    def __init__(self, message: str, error_code: str = "NOT_FOUND"):
        """Initialize not found error.

        Args:
            message: Description of missing resource
            error_code: Machine-readable error code
        """
        super().__init__(message, status_code=404, error_code=error_code)


class ConflictError(AppException):
    """Raised when a conflict occurs (e.g., duplicate resource)."""

    def __init__(self, message: str, error_code: str = "CONFLICT"):
        """Initialize conflict error.

        Args:
            message: Description of conflict
            error_code: Machine-readable error code
        """
        super().__init__(message, status_code=409, error_code=error_code)


class UnauthorizedError(AppException):
    """Raised when authentication fails."""

    def __init__(self, message: str = "Unauthorized", error_code: str = "UNAUTHORIZED"):
        """Initialize unauthorized error.

        Args:
            message: Description of auth failure
            error_code: Machine-readable error code
        """
        super().__init__(message, status_code=401, error_code=error_code)


class ForbiddenError(AppException):
    """Raised when user lacks permission."""

    def __init__(self, message: str = "Forbidden", error_code: str = "FORBIDDEN"):
        """Initialize forbidden error.

        Args:
            message: Description of permission denial
            error_code: Machine-readable error code
        """
        super().__init__(message, status_code=403, error_code=error_code)


class ProcessingError(AppException):
    """Raised when data processing fails."""

    def __init__(self, message: str, error_code: str = "PROCESSING_ERROR"):
        """Initialize processing error.

        Args:
            message: Description of processing failure
            error_code: Machine-readable error code
        """
        super().__init__(message, status_code=422, error_code=error_code)
