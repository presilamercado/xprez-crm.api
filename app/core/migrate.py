"""Simple database migration helper."""

from __future__ import annotations

from pathlib import Path

from alembic import command
from alembic.config import Config

from app.core.config import settings


PROJECT_ROOT = Path(__file__).resolve().parents[2]


def _get_alembic_config() -> Config:
    config_path = PROJECT_ROOT / "alembic.ini"
    alembic_cfg = Config(str(config_path))
    alembic_cfg.set_main_option("script_location", str(PROJECT_ROOT / "migrations"))
    alembic_cfg.set_main_option("sqlalchemy.url", settings.database_url)
    return alembic_cfg


def run_migrations_if_needed() -> bool:
    """Apply Alembic migrations when the schema is missing or stale."""

    alembic_cfg = _get_alembic_config()
    command.upgrade(alembic_cfg, "head")
    return True


__all__ = ["run_migrations_if_needed"]
