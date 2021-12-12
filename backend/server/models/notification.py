from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, ForeignKey

from server.database import Base

class Notification(Base):
  __tablename__ = "notification"

  id = Column(Integer, primary_key=True, autoincrement=True)
  type = Column(String(100), nullable=False)
  scanned_pet_id = Column(Integer, ForeignKey('pet.id'), nullable=False)
  created_at = Column(Date, default=datetime.now, nullable=False)
  updated_at = Column(Date, default=datetime.now, nullable=False)

  def __str__(self):
    return f"[{self.id}][{self.type}] {self.scanned_pet_id}"