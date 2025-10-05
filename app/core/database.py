"""Database session and engine configuration."""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.models.base import Base

engine = create_engine(
    settings.database_url,
    echo=settings.database_echo,
    future=True,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


def get_session() -> Generator[Session, None, None]:
    """FastAPI dependency that provides a SQLAlchemy session."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


__all__ = ["Base", "engine", "get_session", "SessionLocal"]
