import jwt
import asyncio

from datetime import datetime, timedelta
from typing import Optional
from starlette.testclient import TestClient
from unittest import IsolatedAsyncioTestCase

from sqlalchemy.orm.session import Session

from server.database import SessionLocal, Base, engine, database
from server.factory import create_app
from server.models.pet import Pet
from server.models.user_pet import UserPet
from server.utils import get_settings
from server.models import Specie, User

settings = get_settings()

class FakeResponse:
  def __init__(self, response, ok: Optional[bool] = True):
    self.response = response
    self.ok = ok

  def json(self):
    return self.response

class BaseTestCase(IsolatedAsyncioTestCase):
  def __init__(self, methodName: str = ...) -> None:
      super().__init__(methodName)

      self.db: Session = SessionLocal()

  async def asyncSetUp(self) -> None:
    # https://bugs.python.org/issue38608
    asyncio.get_running_loop().set_debug(False)
    await database.connect()
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    self.app = create_app()
    self.client = TestClient(self.app)

    self.db.add(Specie(name="dog"))
    self.db.add(Specie(name="cat"))

    self.db.commit()

    self.user = User(
      first_name="user",
      last_name="lastuser",
      profile_picture="nose.com",
      email="lol@com"
    )

    self.pet_1 = Pet(
      name="woof",
      profile_picture="http://localhost",
      extra="nomthing",
      specie_id=1,
      color="black"
    )

    self.db.add(self.user)
    self.db.add(self.pet_1)

    self.db.commit()

    self.db.add(
      UserPet(
        user_id=self.user.id,
        pet_id=self.pet_1.id
      )
    )

    self.db.commit()

    self.token = jwt.encode({
      "id": self.user.id,
      "uuid": str(self.user.uuid),
      "phone_verified": self.user.phone_verified,
      "exp": datetime.utcnow() + timedelta(minutes=10),
      "iat": datetime.utcnow()
      },
      settings.JWT_SECRET,
      algorithm="HS256"
    )
  
  async def asyncTearDown(self) -> None:
    await database.disconnect()
