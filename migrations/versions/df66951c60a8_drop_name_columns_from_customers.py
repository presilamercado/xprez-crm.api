"""drop name columns from customers

Revision ID: df66951c60a8
Revises: 178ce9fddf44
Create Date: 2025-10-05 22:05:43.258904

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'df66951c60a8'
down_revision: Union[str, Sequence[str], None] = '178ce9fddf44'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_columns = {column["name"] for column in inspector.get_columns("customers")}

    drops: list[str] = []
    if "first_name" in existing_columns:
        drops.append("first_name")
    if "last_name" in existing_columns:
        drops.append("last_name")

    if drops:
        with op.batch_alter_table("customers", schema=None) as batch_op:
            for column_name in drops:
                batch_op.drop_column(column_name)


def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_columns = {column["name"] for column in inspector.get_columns("customers")}

    to_add: list[tuple[str, sa.types.TypeEngine]] = []
    if "first_name" not in existing_columns:
        to_add.append(("first_name", sa.String(length=100)))
    if "last_name" not in existing_columns:
        to_add.append(("last_name", sa.String(length=100)))

    if to_add:
        with op.batch_alter_table("customers", schema=None) as batch_op:
            for name, column_type in to_add:
                batch_op.add_column(
                    sa.Column(name, column_type, nullable=False, server_default=""),
                )

        for name, _ in to_add:
            op.execute(sa.text(f"UPDATE customers SET {name} = '' WHERE {name} IS NULL"))
