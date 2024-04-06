"""fcmtoken model

Revision ID: 662fec48ca82
Revises: db4039dd743f
Create Date: 2023-12-03 06:47:40.746501

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '662fec48ca82'
down_revision = 'db4039dd743f'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "fcmtoken",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("fcm_token", sa.String(256), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("user.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id")
    )
    op.create_unique_constraint('constraint_fcmtoken_unique_fcmtoken', 'fcmtoken', ['fcm_token'])


def downgrade():
    op.drop_constraint('constraint_fcmtoken_unique_fcmtoken', type_='unique')

    op.drop_table('fcmtoken')