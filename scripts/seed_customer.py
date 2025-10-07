"""Seed a customer record directly into the database."""

from __future__ import annotations

import json
import sys
from typing import Any
from uuid import UUID

try:  # pragma: no cover - defensive import handling
    from sqlalchemy.exc import SQLAlchemyError
    from app.core.database import SessionLocal
    from app.models.customer import Customer
except ModuleNotFoundError as exc:  # pragma: no cover - better runtime error
    missing_module = exc.name
    raise SystemExit(
        "Required Python dependencies are missing. Ensure your virtualenv is active "
        "and run 'pip install -r requirements.txt'. Missing module: "
        f"{missing_module}"
    ) from exc


def _serialize_customer(customer: Customer) -> dict[str, Any]:
    """Return a JSON-serialisable representation of the customer."""

    return {
        "id": customer.id,
        "email": customer.email,
        "phone": customer.phone,
        "company_name": customer.company_name,
        "notes": customer.notes,
        "is_active": customer.is_active,
        "created_at": customer.created_at.isoformat() if customer.created_at else None,
        "updated_at": customer.updated_at.isoformat() if customer.updated_at else None,
    }


def main(raw_payload: str) -> None:
    payload = json.loads(raw_payload)

    session = SessionLocal()
    try:
        customer = Customer(**payload)
        session.add(customer)
        session.commit()
        session.refresh(customer)
    except SQLAlchemyError as exc:  # pragma: no cover - CLI utility
        session.rollback()
        raise SystemExit(f"Database error: {exc}") from exc
    finally:
        session.close()

    def _default(obj: Any) -> str:
        if isinstance(obj, UUID):
            return str(obj)
        raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

    print(json.dumps(_serialize_customer(customer), default=_default))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("Expected JSON payload argument")

    main(sys.argv[1])
