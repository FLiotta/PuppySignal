from datetime import datetime
from sqlalchemy import Integer, String, Date, Column, ForeignKey

from server.database import Base


class PetLocation(Base):
    __tablename__ = "pet_location"

    id = Column(Integer, primary_key=True, autoincrement=True)
    pet_id = Column(Integer, ForeignKey("pet.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("location.id"), nullable=False)
    method = Column(String(50))
    created_at = Column(Date, default=datetime.now, nullable=False)
    updated_at = Column(Date, default=datetime.now, nullable=False)
