"""Pydantic schemas exposed for API usage."""

from app.schemas.contact import (
    ContactBase,
    ContactCreate,
    ContactRead,
    ContactUpdate,
)
from app.schemas.customer import (
    CustomerBase,
    CustomerCreate,
    CustomerRead,
    CustomerUpdate,
)

__all__ = [
    "ContactBase",
    "ContactCreate",
    "ContactRead",
    "ContactUpdate",
    "CustomerBase",
    "CustomerCreate",
    "CustomerRead",
    "CustomerUpdate",
]
