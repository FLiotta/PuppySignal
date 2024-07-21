import uuid

from typing import Optional
from pydantic import BaseModel


class UserSchema(BaseModel):
    id: int
    uuid: uuid.UUID
    first_name: str
    last_name: str
    email: str
    profile_picture: Optional[str]
    phone_number: Optional[str]

    class Config:
        orm_mode = True
