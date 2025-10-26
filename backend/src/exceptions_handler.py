"""Global error handling middleware and exception handlers."""
from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from src.exceptions import AppException


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """Handle application exceptions.

    Args:
        request: The incoming request
        exc: The application exception

    Returns:
        JSON response with error details
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.message,
            "error_code": exc.error_code,
            "status_code": exc.status_code,
        },
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle unexpected exceptions.

    Args:
        request: The incoming request
        exc: The unexpected exception

    Returns:
        JSON response with generic error message
    """
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "An unexpected error occurred",
            "error_code": "INTERNAL_ERROR",
            "status_code": 500,
        },
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Register exception handlers with FastAPI application.

    Args:
        app: FastAPI application instance
    """
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
