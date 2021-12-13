from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from server.database import Base

class UserPet(Base):
  __tablename__ = "user_pet"

  id = Column(Integer, primary_key=True, nullable=False)
  user_id = Column(Integer, ForeignKey('user.id'))
  pet_id = Column(Integer, ForeignKey('pet.id'))