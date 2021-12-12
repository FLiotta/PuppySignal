from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class UserSchema(BaseModel):
  id: int
  uuid: str
  first_name: str
  last_name: str
  email: str
  profile_picture: Optional[str]
  phone_number: Optional[str]
  validated_profile_phone_number: bool

  class Config:
    orm_mode = True