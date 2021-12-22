from typing import Optional
import uuid
from pydantic import BaseModel

from server.schemas import SpecieSchema

class PetSchema(BaseModel):
  id: int
  uuid: uuid.UUID
  name: str
  profile_picture: Optional[str]
  extra: Optional[str]
  color: Optional[str]
  specie: Optional[SpecieSchema]

  class Config:
    orm_mode = True