"""lost_since field at pet, breeds

Revision ID: 87b16aa05bcc
Revises: 662fec48ca82
Create Date: 2023-12-10 06:29:23.589484

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "87b16aa05bcc"
down_revision = "662fec48ca82"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "breed",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(50), nullable=False),
        sa.Column("specie_id", sa.Integer(), sa.ForeignKey("specie.id")),
        sa.PrimaryKeyConstraint("id"),
    )

    op.add_column("pet", sa.Column("breed_id", sa.Integer(), sa.ForeignKey("breed.id")))

    op.add_column("pet", sa.Column("lost_since", sa.DateTime(), nullable=True))


def downgrade():
    pass
