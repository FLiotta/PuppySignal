"""Renamed pet.extra field to description

Revision ID: a2cc5bfb0faa
Revises: 87b16aa05bcc
Create Date: 2024-04-06 21:32:25.326904

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a2cc5bfb0faa'
down_revision = '86045e57f7e8'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('pet', 'extra', new_column_name='description')


def downgrade():
    op.alter_column('pet', 'description', new_column_name='extra')
