import jwt

from datetime import datetime, timedelta
from typing import Optional
from starlette.testclient import TestClient
from unittest import TestCase

from server.database import SessionLocal, Base, engine
from server.factory import create_app
from server.config import Settings
from server.utils import get_settings
from server.models import Specie, User, Pet, UserPet, Location, Code, PetLocation, Breed


def get_settings_override():
    return Settings(
        JWT_SECRET="helloworld", redis_host="http://localhost", redis_port="6379"
    )


class FakeResponse:
    def __init__(self, response, ok: Optional[bool] = True):
        self.response = response
        self.ok = ok

    def json(self):
        return self.response


class BaseTestCase(TestCase):
    def setUp(self) -> None:
        Base.metadata.create_all(bind=engine)
        self.settings: Settings = get_settings_override()

        app = create_app()
        app.dependency_overrides[get_settings] = get_settings_override

        self.client = TestClient(app)
        self.db = SessionLocal()

        self.db.add(Specie(name="dog"))
        self.db.add(Specie(name="cat"))

        self.user = User(
            first_name="Fabrizio",
            last_name="Nose",
            profile_picture="http://localhost:8000/imgs/avatars/my_avatar.png",
            email="loremipsum@gmail.com",
            phone_number="+5493413200000",
        )

        self.user_2 = User(
            first_name="Javier",
            last_name="Unknown",
            profile_picture="http://localhost:8000/imgs/avatars/my_avatar_2.png",
            email="loremipsum_2@gmail.com",
            phone_number="+5493413205000",
        )

        self.pet_1 = Pet(
            name="Remo",
            profile_picture="http://localhost:8000/imgs/pets/remo_1.png",
            description="Funny little dog.",
            specie_id=1,
            color="black",
        )

        self.db.add(self.user)
        self.db.add(self.user_2)
        self.db.add(self.pet_1)

        self.db.commit()

        self.db.add(Breed(name="Dogo Argentino", specie_id=1))
        self.db.add(Breed(name="Dachshund", specie_id=1))

        self.location = Location(latitude=1, longitude=2)
        self.code = Code(pet_id=self.pet_1.id)

        self.db.add(self.location)
        self.db.add(self.code)

        self.db.add(UserPet(user_id=self.user.id, pet_id=self.pet_1.id))

        self.db.commit()

        self.db.add(
            PetLocation(
                pet_id=self.pet_1.id, location_id=self.location.id, method="SCANNED"
            )
        )

        self.db.commit()

        self.token = jwt.encode(
            {
                "id": self.user.id,
                "uuid": str(self.user.uuid),
                "exp": datetime.utcnow() + timedelta(minutes=10),
                "iat": datetime.utcnow(),
            },
            self.settings.JWT_SECRET,
            algorithm="HS256",
        )

        self.token_2 = jwt.encode(
            {
                "id": self.user_2.id,
                "uuid": str(self.user_2.uuid),
                "exp": datetime.utcnow() + timedelta(minutes=10),
                "iat": datetime.utcnow(),
            },
            self.settings.JWT_SECRET,
            algorithm="HS256",
        )

        return super().setUp()

    def tearDown(self) -> None:
        Base.metadata.drop_all(bind=engine)
        self.db.close()

        return super().tearDown()
