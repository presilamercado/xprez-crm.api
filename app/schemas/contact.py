"""Pydantic schemas for contact resources."""

from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class ContactBase(BaseModel):
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(..., max_length=100)
    role_title: Optional[str] = Field(default=None, max_length=100)
    email: EmailStr
    phone_mobile: Optional[str] = Field(default=None, max_length=30)
    phone_work: Optional[str] = Field(default=None, max_length=30)
    is_primary: bool = False


class ContactCreate(ContactBase):
    customer_id: Optional[UUID] = None


class ContactUpdate(BaseModel):
    first_name: Optional[str] = Field(default=None, max_length=100)
    last_name: Optional[str] = Field(default=None, max_length=100)
    role_title: Optional[str] = Field(default=None, max_length=100)
    email: Optional[EmailStr] = None
    phone_mobile: Optional[str] = Field(default=None, max_length=30)
    phone_work: Optional[str] = Field(default=None, max_length=30)
    is_primary: Optional[bool] = None


class ContactRead(ContactBase):
    id: UUID
    customer_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
    }


__all__ = [
    "ContactBase",
    "ContactCreate",
    "ContactUpdate",
    "ContactRead",
]
