"""Customer API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_session
from app.routers import CustomerCRUD
from app.models import Customer
from app.schemas import CustomerCreate, CustomerRead, CustomerUpdate

router = APIRouter(prefix="/customers", tags=["Customers"])


def _get_customer_or_404(session: Session, customer_id: int) -> Customer:
    customer = CustomerCRUD(session).get(customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return customer


@router.get("/", response_model=list[CustomerRead])
def list_customers(
    *,
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=250, description="Maximum records to return"),
    session: Session = Depends(get_session),
) -> list[CustomerRead]:
    customers = CustomerCRUD(session).list(skip=skip, limit=limit)
    return [CustomerRead.model_validate(customer) for customer in customers]


@router.get("/{customer_id}", response_model=CustomerRead)
def retrieve_customer(
    *,
    customer_id: int,
    session: Session = Depends(get_session),
) -> CustomerRead:
    customer = _get_customer_or_404(session, customer_id)
    return CustomerRead.model_validate(customer)


@router.post("/", response_model=CustomerRead, status_code=status.HTTP_201_CREATED)
def create_customer(
    *,
    payload: CustomerCreate,
    session: Session = Depends(get_session),
) -> CustomerRead:
    crud = CustomerCRUD(session)
    try:
        customer = crud.create(payload)
    except IntegrityError as exc:  # email uniqueness, etc.
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Customer with this email already exists",
        ) from exc

    return CustomerRead.model_validate(customer)


@router.put("/{customer_id}", response_model=CustomerRead)
def update_customer(
    *,
    customer_id: int,
    payload: CustomerUpdate,
    session: Session = Depends(get_session),
) -> CustomerRead:
    crud = CustomerCRUD(session)
    customer = _get_customer_or_404(session, customer_id)
    try:
        updated = crud.update(customer, payload)
    except IntegrityError as exc:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Customer with this email already exists",
        ) from exc

    return CustomerRead.model_validate(updated)


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    *,
    customer_id: int,
    session: Session = Depends(get_session),
) -> None:
    customer = _get_customer_or_404(session, customer_id)
    CustomerCRUD(session).delete(customer)


__all__ = ["router"]
