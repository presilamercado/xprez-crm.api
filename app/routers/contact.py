"""CRUD helpers for contact resources."""

from __future__ import annotations

from collections.abc import Sequence
from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactUpdate


class ContactCRUD:
    """Encapsulates contact persistence operations."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def list_by_customer(
        self,
        *,
        customer_id: UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[Contact]:
        statement = (
            select(Contact)
            .where(Contact.customer_id == customer_id)
            .offset(skip)
            .limit(limit)
        )
        return self.session.scalars(statement).all()

    def get(self, contact_id: UUID) -> Optional[Contact]:
        return self.session.get(Contact, contact_id)

    def create(self, payload: ContactCreate) -> Contact:
        contact = Contact(**payload.model_dump())
        self.session.add(contact)
        self.session.commit()
        self.session.refresh(contact)
        return contact

    def update(self, contact: Contact, payload: ContactUpdate) -> Contact:
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(contact, field, value)
        self.session.commit()
        self.session.refresh(contact)
        return contact

    def delete(self, contact: Contact) -> None:
        self.session.delete(contact)
        self.session.commit()


__all__ = ["ContactCRUD"]
