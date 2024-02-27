from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


class Breed(Base):
    __tablename__ = "breed"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    name = Column(String(50), nullable=False)
    specie_id = Column(Integer, ForeignKey("specie.id"))

    specie = relationship("Specie", back_populates="breeds")
    pets = relationship("Pet", back_populates="breed")

    def __str__(self):
        return f"[{self.id}] {self.name}"
