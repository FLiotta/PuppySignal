from datetime import datetime
from pydantic import BaseModel

from server.schemas import PetSchema

class NotificationSchema(BaseModel):
  id: int
  type: str
  scanned_pet_id: int

  class Config:
    orm_mode = True

class NotificationWithPetSchema(BaseModel):
  id: int
  type: str
  pet: PetSchema

  class Config:
    orm_mode = True