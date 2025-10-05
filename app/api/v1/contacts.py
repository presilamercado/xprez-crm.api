"""Contact API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_session
from app.models import Contact
from app.routers import ContactCRUD, CustomerCRUD
from app.schemas import ContactCreate, ContactRead, ContactUpdate

router = APIRouter(tags=["Contacts"])


def _get_contact_or_404(session: Session, contact_id: UUID) -> Contact:
    contact = ContactCRUD(session).get(contact_id)
    if not contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    return contact


@router.get("/customers/{customer_id}/contacts", response_model=list[ContactRead])
def list_contacts(
    *,
    customer_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=250),
    session: Session = Depends(get_session),
) -> list[ContactRead]:
    if not CustomerCRUD(session).get(customer_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    contacts = ContactCRUD(session).list_by_customer(
        customer_id=customer_id, skip=skip, limit=limit
    )
    return [ContactRead.model_validate(contact) for contact in contacts]


@router.get("/contacts/{contact_id}", response_model=ContactRead)
def retrieve_contact(
    *,
    contact_id: UUID,
    session: Session = Depends(get_session),
) -> ContactRead:
    contact = _get_contact_or_404(session, contact_id)
    return ContactRead.model_validate(contact)


@router.post(
    "/customers/{customer_id}/contacts",
    response_model=ContactRead,
    status_code=status.HTTP_201_CREATED,
)
def create_contact(
    *,
    customer_id: UUID,
    payload: ContactCreate,
    session: Session = Depends(get_session),
) -> ContactRead:
    customer = CustomerCRUD(session).get(customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    crud = ContactCRUD(session)
    try:
        contact = crud.create(payload.model_copy(update={"customer_id": customer_id}))
    except IntegrityError as exc:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Contact email already exists",
        ) from exc

    return ContactRead.model_validate(contact)


@router.put("/contacts/{contact_id}", response_model=ContactRead)
def update_contact(
    *,
    contact_id: UUID,
    payload: ContactUpdate,
    session: Session = Depends(get_session),
) -> ContactRead:
    crud = ContactCRUD(session)
    contact = _get_contact_or_404(session, contact_id)
    try:
        updated = crud.update(contact, payload)
    except IntegrityError as exc:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Contact email already exists",
        ) from exc

    return ContactRead.model_validate(updated)


@router.delete("/contacts/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(
    *,
    contact_id: UUID,
    session: Session = Depends(get_session),
) -> None:
    contact = _get_contact_or_404(session, contact_id)
    ContactCRUD(session).delete(contact)


__all__ = ["router"]
