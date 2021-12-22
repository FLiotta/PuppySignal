import uuid
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql.schema import ForeignKey

from server.database import Base

class Pet(Base):
  __tablename__ = "pet"

  id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
  uuid = Column(UUID(as_uuid=True), default=uuid.uuid4,nullable=False)
  name = Column(String(50), nullable=False)
  profile_picture = Column(String(150))
  extra = Column(String(220))
  color = Column(String(50))
  specie_id = Column(Integer, ForeignKey("specie.id"))

  owners = relationship("User", secondary="user_pet", back_populates="pets")
  specie = relationship("Specie", back_populates="pets", lazy='noload')
  codes = relationship("Code", back_populates="pet")
  locations = relationship("Location", secondary="pet_location", backref="pet")

  def __str__(self):
    return f"[{self.uuid}][{self.id}] {self.name}"