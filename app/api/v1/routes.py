from fastapi import APIRouter

from app.api.v1 import contacts, customers

api_router = APIRouter()
api_router.include_router(customers.router)
api_router.include_router(contacts.router)


@api_router.get("/health", tags=["Health"], summary="Service health check")
async def health_check() -> dict[str, str]:
    """Simple endpoint to verify the API is running."""
    return {"status": "ok"}
