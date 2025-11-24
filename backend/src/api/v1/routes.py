"""API route configuration."""
from fastapi import APIRouter

from src.schemas.base import HealthCheck

api_router = APIRouter()


@api_router.get("/health", response_model=HealthCheck, tags=["status"])
async def health_check() -> HealthCheck:
    """Check API health status."""
    return HealthCheck(message="Service is running")


# Import and include other routers here as they are implemented
from src.api.v1 import collections, photos, locations, exports, flights

api_router.include_router(collections.router, prefix="/collections", tags=["collections"])
api_router.include_router(photos.router, prefix="/photos", tags=["photos"])
api_router.include_router(locations.router, prefix="/locations", tags=["locations"])
api_router.include_router(exports.router, prefix="/exports", tags=["exports"])
api_router.include_router(flights.router, prefix="/flights", tags=["flights"])
