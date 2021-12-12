from datetime import datetime
from pydantic import BaseModel

class NotificationSchema(BaseModel):
  id: int
  type: str
  scanned_pet_id: int

  class Config:
    orm_mode = True