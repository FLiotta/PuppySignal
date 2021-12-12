from typing import Optional
from pydantic import BaseModel

from server.schemas import PetSchema, UserSchema

class UserPetSchema(BaseModel):
  id: int
  user: UserSchema
  pet: PetSchema

  class Config:
    orm_mode = True