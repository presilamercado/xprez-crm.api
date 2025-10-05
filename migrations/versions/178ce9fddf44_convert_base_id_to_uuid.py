"""convert base id to uuid

Revision ID: 178ce9fddf44
Revises: 0c6e590d3096
Create Date: 2025-10-05 15:46:23.105455

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '178ce9fddf44'
down_revision: Union[str, Sequence[str], None] = '0c6e590d3096'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    op.add_column(
        "customers",
        sa.Column(
            "id_tmp",
            postgresql.UUID(as_uuid=True),
            nullable=False,
            server_default=sa.text("uuid_generate_v4()"),
        ),
    )

    op.execute('UPDATE customers SET id_tmp = uuid_generate_v4()')

    op.drop_constraint("customers_pkey", "customers", type_="primary")
    op.drop_column("customers", "id")
    op.alter_column(
        "customers",
        "id_tmp",
        new_column_name="id",
        existing_type=postgresql.UUID(as_uuid=True),
        nullable=False,
        server_default=sa.text("uuid_generate_v4()"),
    )
    op.create_primary_key("customers_pkey", "customers", ["id"])


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column("customers", sa.Column("id_tmp", sa.Integer(), nullable=True))

    op.execute("DROP SEQUENCE IF EXISTS customers_id_seq")
    op.execute("CREATE SEQUENCE customers_id_seq")
    op.execute("ALTER SEQUENCE customers_id_seq RESTART WITH 1")
    op.execute("UPDATE customers SET id_tmp = nextval('customers_id_seq')")

    op.drop_constraint("customers_pkey", "customers", type_="primary")
    op.drop_column("customers", "id")
    op.alter_column("customers", "id_tmp", new_column_name="id")
    op.execute("ALTER SEQUENCE customers_id_seq OWNED BY customers.id")
    op.alter_column(
        "customers",
        "id",
        existing_type=sa.Integer(),
        nullable=False,
        server_default=sa.text("nextval('customers_id_seq')"),
    )
    op.create_primary_key("customers_pkey", "customers", ["id"])
