"""Contact ORM model."""

from __future__ import annotations

from typing import Optional
from uuid import UUID

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Contact(Base):
    """Represents a contact associated with a customer."""

    __tablename__ = "contacts"

    customer_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("customers.id", ondelete="CASCADE"), nullable=False
    )
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    role_title: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    phone_mobile: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    phone_work: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    is_primary: Mapped[bool] = mapped_column(default=False, nullable=False)

    customer = relationship(
        "Customer",
        back_populates="contacts",
    )


__all__ = ["Contact"]
