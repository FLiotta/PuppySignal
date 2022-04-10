"""ForeignKeys and relations tables

Revision ID: 8bafae4bb950
Revises: 0e8319262c8d
Create Date: 2022-04-09 20:43:43.212600

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8bafae4bb950'
down_revision = '0e8319262c8d'
branch_labels = None
depends_on = None


def upgrade():
    # Constraints
    # Pet specie_id constraint
    op.add_column(
      "pet",
      sa.Column("specie_id", sa.Integer(), sa.ForeignKey("specie.id"))
    )
    
    # Code pet_id constraint
    op.add_column(
      "code",
      sa.Column("pet_id", sa.Integer(), sa.ForeignKey("pet.id"))
    )

    # Notification scanned_pet_id constraint
    op.add_column(
      "notification",
      sa.Column("scanned_pet_id", sa.Integer(), sa.ForeignKey("pet.id"))
    )

    # Relations
    # UserAuth
    op.create_table(
      "user_auth",
      sa.Column("id", sa.Integer(), nullable=False),
      sa.Column("oauth_id", sa.String(50), nullable=False),
      sa.Column("method", sa.String(50), nullable=False),
      sa.Column("user_id", sa.Integer(), sa.ForeignKey("user.id"), nullable=False),
      sa.Column("created_at", sa.DateTime(), nullable=False),
      sa.Column("updated_at", sa.DateTime(), nullable=False),
      sa.PrimaryKeyConstraint("id")
    )

    # UserPet
    op.create_table(
      "user_pet",
      sa.Column("id", sa.Integer(), nullable=False),
      sa.Column("user_id", sa.Integer(), sa.ForeignKey("user.id"), nullable=False),
      sa.Column("pet_id", sa.Integer(), sa.ForeignKey("pet.id"), nullable=False),
      sa.PrimaryKeyConstraint("id")
    )

    # UserNotification
    op.create_table(
      "user_notification",
      sa.Column("id", sa.Integer(), nullable=False),
      sa.Column("user_id", sa.Integer(), sa.ForeignKey("user.id"), nullable=False),
      sa.Column("notification_id", sa.Integer(), sa.ForeignKey("notification.id"), nullable=False),
      sa.PrimaryKeyConstraint("id")
    )

    # PetLocation
    op.create_table(
      "pet_location",
      sa.Column("id", sa.Integer(), nullable=False),
      sa.Column("pet_id", sa.Integer(), sa.ForeignKey("pet.id"), nullable=False),
      sa.Column("location_id", sa.Integer(), sa.ForeignKey("location.id"), nullable=False),
      sa.Column("method", sa.String(50), nullable=False),
      sa.Column("created_at", sa.DateTime(), nullable=False),
      sa.Column("updated_at", sa.DateTime(), nullable=False),
      sa.PrimaryKeyConstraint("id")
    )

    # RefreshToken
    op.create_table(
      "refresh_token",
      sa.Column("id", sa.Integer(), nullable=False),
      sa.Column("token", sa.String(2000), nullable=False),
      sa.Column("user_id", sa.Integer(), sa.ForeignKey("user.id"), nullable=False),
      sa.Column("valid_until", sa.DateTime(), nullable=False),
      sa.PrimaryKeyConstraint("id")
    )

def downgrade():
    pass
