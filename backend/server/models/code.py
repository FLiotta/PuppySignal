from datetime import datetime
from sqlalchemy import Column, Integer, Date, String, ForeignKey
from sqlalchemy.orm import relationship
from nanoid import generate

from server.database import Base

def code_generator():
  return generate(size=10)

class Code(Base):
  __tablename__ = "code"

  id = Column(Integer, primary_key=True, nullable=False)
  code = Column(String, unique=True, nullable=False, default=code_generator)
  pet_id = Column(Integer, ForeignKey('pet.id'))
  created_at = Column(Date, default=datetime.now, nullable=False)
  updated_at = Column(Date, default=datetime.now, nullable=False)

  pet = relationship("Pet", back_populates="codes")

  def __str__(self):
    return f"[{self.id}][{self.code}] {self.code}"