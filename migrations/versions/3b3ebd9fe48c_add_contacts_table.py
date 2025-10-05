"""add contacts table

Revision ID: 3b3ebd9fe48c
Revises: df66951c60a8
Create Date: 2025-10-05 22:20:19.610615

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '3b3ebd9fe48c'
down_revision: Union[str, Sequence[str], None] = 'df66951c60a8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    op.create_table(
        "contacts",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            nullable=False,
            server_default=sa.text("uuid_generate_v4()"),
        ),
        sa.Column(
            "customer_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("customers.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("first_name", sa.String(length=100), nullable=False),
        sa.Column("last_name", sa.String(length=100), nullable=False),
        sa.Column("role_title", sa.String(length=100), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone_mobile", sa.String(length=30), nullable=True),
        sa.Column("phone_work", sa.String(length=30), nullable=True),
        sa.Column(
            "is_primary",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.TIMESTAMP(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )

    op.create_index("ix_contacts_email", "contacts", ["email"], unique=False)
    op.create_index("ix_contacts_customer_id", "contacts", ["customer_id"], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index("ix_contacts_customer_id", table_name="contacts")
    op.drop_index("ix_contacts_email", table_name="contacts")
    op.drop_table("contacts")
