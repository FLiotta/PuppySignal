from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from server.database import Base


class Specie(Base):
    __tablename__ = "specie"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(50), nullable=False)

    pets = relationship("Pet", back_populates="specie")
    breeds = relationship("Breed", back_populates="specie")

    def __str__(self):
        return f"[{self.id}] {self.name}"
