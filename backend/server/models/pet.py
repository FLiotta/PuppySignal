import uuid
from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey

from server.database import Base


def get_uuid():
    _ = uuid.uuid4()

    return str(_)


class Pet(Base):
    __tablename__ = "pet"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    uuid = Column(String(80), default=get_uuid, nullable=False)
    name = Column(String(50), nullable=False)
    profile_picture = Column(String(150))
    description = Column(String(220))
    color = Column(String(50))
    specie_id = Column(Integer, ForeignKey("specie.id"))
    breed_id = Column(Integer, ForeignKey("breed.id"))
    lost_since = Column(Date, nullable=True)

    owners = relationship("User", secondary="user_pet", back_populates="pets")
    specie = relationship("Specie", back_populates="pets", lazy="noload")
    breed = relationship("Breed", back_populates="pets", lazy="noload")
    codes = relationship("Code", back_populates="pet", cascade="all,delete")
    locations = relationship(
        "Location", secondary="pet_location", backref="pet", cascade="all,delete"
    )

    def __str__(self):
        return f"[{self.uuid}][{self.id}] {self.name}"
