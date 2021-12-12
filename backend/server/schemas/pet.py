from typing import Optional
from pydantic import BaseModel

from server.schemas import SpecieSchema

class PetSchema(BaseModel):
  id: int
  uuid: str
  name: str
  profile_picture: Optional[str]
  extra: Optional[str]
  color: Optional[str]
  specie: SpecieSchema

  class Config:
    orm_mode = True