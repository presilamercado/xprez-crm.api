"""Base declarative class for ORM models."""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Declarative base used by all ORM models."""

    pass


__all__ = ["Base"]
