from fastapi import FastAPI
from fastapi.responses import RedirectResponse

from app.api.v1.routes import api_router
from app.core.config import settings
from app.core.migrate import run_migrations_if_needed


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title=settings.project_name,
        version=settings.version,
        openapi_url=f"{settings.api_v1_prefix}/openapi.json",
        docs_url=f"{settings.api_v1_prefix}/docs",
        redoc_url=f"{settings.api_v1_prefix}/redoc",
    )

    app.include_router(api_router, prefix=settings.api_v1_prefix)

    @app.get("/", include_in_schema=False)
    async def index() -> RedirectResponse:
        """Redirect root requests to the interactive Swagger UI."""
        if not app.docs_url:  # FastAPI allows disabling docs entirely.
            raise RuntimeError("Swagger UI is disabled for this application")
        return RedirectResponse(url=app.docs_url)

    @app.on_event("startup")
    async def startup_migrations() -> None:
        """Ensure database schema exists when the service starts."""
        run_migrations_if_needed()

    return app


app = create_app()
