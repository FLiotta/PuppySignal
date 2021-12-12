from datetime import datetime

from sqlalchemy import Column, Integer, Float, Date

from server.database import Base

class Location(Base):
  __tablename__ = "location"

  id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
  latitude = Column(Float, nullable=False)
  longitude = Column(Float, nullable=False)
  created_at = Column(Date, default=datetime.now, nullable=False)
  updated_at = Column(Date, default=datetime.now, nullable=False)

  def __str__(self):
    return f"[{self.id}] {self.latitude} {self.longitude}"