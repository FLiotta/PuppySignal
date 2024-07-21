import uuid
from datetime import datetime

from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship

from server.database import Base


def get_uuid():
    _ = uuid.uuid4()

    return str(_)


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    uuid = Column(String(80), unique=True, default=get_uuid, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(50), nullable=False)
    profile_picture = Column(String(150))
    phone_number = Column(String(50))
    created_at = Column(Date, default=datetime.now, nullable=False)
    updated_at = Column(Date, default=datetime.now, nullable=False)

    pets = relationship("Pet", secondary="user_pet", back_populates="owners")
    auths = relationship("UserAuth", back_populates="user")

    def __str__(self):
        return f"[{self.uuid}][{self.id}] {self.first_name} {self.last_name}"
