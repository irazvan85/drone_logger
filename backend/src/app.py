"""Main FastAPI application entry point."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.v1.routes import api_router
from src.config import get_settings, setup_logging
from src.db.session import dispose_db, init_db
from src.exceptions_handler import register_exception_handlers


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle manager."""
    # Startup
    setup_logging()
    await init_db()
    yield
    # Shutdown
    await dispose_db()


def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)

    # Routes
    app.include_router(api_router, prefix=settings.API_V1_STR)

    @app.get("/", tags=["status"])
    async def root() -> dict:
        """Root endpoint with API information."""
        return {
            "message": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "docs": "/docs",
            "redoc": "/redoc",
            "health": f"{settings.API_V1_STR}/health",
            "api_prefix": settings.API_V1_STR,
        }

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("src.app:app", host="0.0.0.0", port=8000, reload=True)
