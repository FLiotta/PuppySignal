"""base_breeds_species_records

Revision ID: 86045e57f7e8
Revises: 87b16aa05bcc
Create Date: 2023-12-10 06:45:06.427928

"""
import json
import os
from alembic import op
from sqlalchemy.orm import Session


from server.models import Specie, Breed


# revision identifiers, used by Alembic.
revision = "86045e57f7e8"
down_revision = "87b16aa05bcc"
branch_labels = None
depends_on = None


def upgrade():
    script_dir = os.path.dirname(os.path.realpath(__file__))
    dog_breeds_path = os.path.join(script_dir, "dog_breeds.json")
    cat_breeds_path = os.path.join(script_dir, "cat_breeds.json")

    bind = op.get_bind()
    session = Session(bind=bind)

    dog_model = Specie(name="dog")

    session.add(dog_model)
    session.flush()

    dog_breeds_file = open(dog_breeds_path)
    dog_breeds = json.load(dog_breeds_file)

    dog_breeds.append("Mixed")

    for dog_breed in dog_breeds:
        session.add(Breed(name=dog_breed, specie_id=dog_model.id))

    dog_breeds_file.close()

    cat_model = Specie(name="cat")

    session.add(cat_model)
    session.flush()

    cat_breeds_file = open(cat_breeds_path)
    cat_breeds = json.load(cat_breeds_file)

    cat_breeds.append("Mixed")

    for cat_breed in cat_breeds:
        session.add(Breed(name=cat_breed, specie_id=cat_model.id))

    cat_breeds_file.close()

    session.commit()

    session.close()


def downgrade():
    pass