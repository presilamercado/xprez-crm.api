"""CRUD helpers for customer resources."""

from __future__ import annotations

from collections.abc import Sequence
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate


class CustomerCRUD:
    """Encapsulates customer persistence operations."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def list(self, *, skip: int = 0, limit: int = 100) -> Sequence[Customer]:
        statement = select(Customer).offset(skip).limit(limit)
        return self.session.scalars(statement).all()

    def get(self, customer_id: int) -> Optional[Customer]:
        return self.session.get(Customer, customer_id)

    def create(self, payload: CustomerCreate) -> Customer:
        customer = Customer(**payload.model_dump())
        self.session.add(customer)
        self.session.commit()
        self.session.refresh(customer)
        return customer

    def update(self, customer: Customer, payload: CustomerUpdate) -> Customer:
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(customer, field, value)
        self.session.commit()
        self.session.refresh(customer)
        return customer

    def delete(self, customer: Customer) -> None:
        self.session.delete(customer)
        self.session.commit()


__all__ = ["CustomerCRUD"]
