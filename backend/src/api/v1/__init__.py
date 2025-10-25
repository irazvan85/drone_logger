"""API v1 router."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/", tags=["API"])
async def api_root():
    """API v1 root endpoint."""
    return {
        "message": "Drone Photo GPS Visualizer API v1",
        "endpoints": {
            "collections": "/collections",
            "photos": "/photos",
            "flights": "/flights",
        },
    }
