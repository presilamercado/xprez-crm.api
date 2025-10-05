"""Pydantic schemas for customer resources."""

from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class CustomerBase(BaseModel):
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=30)
    company_name: Optional[str] = Field(default=None, max_length=255)
    notes: Optional[str] = Field(default=None, max_length=500)
    is_active: bool = True


class CustomerCreate(CustomerBase):
    """Payload schema for creating a new customer."""


class CustomerUpdate(BaseModel):
    """Payload schema for partially updating an existing customer."""

    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, max_length=30)
    company_name: Optional[str] = Field(default=None, max_length=255)
    notes: Optional[str] = Field(default=None, max_length=500)
    is_active: Optional[bool] = None


class CustomerRead(CustomerBase):
    """Response schema representing a persisted customer."""

    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
    }


__all__ = [
    "CustomerBase",
    "CustomerCreate",
    "CustomerRead",
    "CustomerUpdate",
]
