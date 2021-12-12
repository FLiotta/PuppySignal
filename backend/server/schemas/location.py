from datetime import datetime
from pydantic import BaseModel

class LocationSchema(BaseModel):
  id: int
  latitude: str
  longitude: str

  class Config:
    orm_mode = True