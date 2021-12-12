from typing import Optional
from pydantic import BaseModel
from server.schemas import PetSchema

class CodeSchema(BaseModel):
  id: int
  code: str
  pet: Optional[PetSchema]

  class Config:
    orm_mode = True