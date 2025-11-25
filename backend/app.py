"""Application entry point and configuration."""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.v1.routes import api_router as v1_router
from src.config import get_settings
from src.db.session import dispose_db, init_db
from src.exceptions_handler import register_exception_handlers
from src.schemas.base import HealthCheck


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle."""
    # Startup
    print("Application starting up...")
    try:
        await init_db()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")

    yield

    # Shutdown
    print("Application shutting down...")
    await dispose_db()
    print("Database connections closed")


# Create FastAPI app
settings = get_settings()
app = FastAPI(
    title=settings.APP_NAME,
    description="API for importing and visualizing drone photos with GPS coordinates on a map",
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register exception handlers
register_exception_handlers(app)


# Health check endpoint
@app.get("/health", tags=["Health"], response_model=HealthCheck)
async def health_check() -> HealthCheck:
    """Health check endpoint.

    Returns:
        HealthCheck: Service health status
    """
    return HealthCheck(
        status="healthy",
        version="0.1.0",
        message="Drone Photo GPS Visualizer API is running",
    )


# Include API routes
app.include_router(v1_router, prefix="/api/v1", tags=["v1"])


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information.

    Returns:
        dict: API information and links
    """
    return {
        "message": "Drone Photo GPS Visualizer API",
        "version": "0.1.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health",
        "api_prefix": "/api/v1",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=os.getenv("ENV", "development") == "development",
    )
