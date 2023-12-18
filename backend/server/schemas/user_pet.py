from pydantic import BaseModel

from server.schemas.pet import PetSchema
from server.schemas.user import UserSchema


class UserPetSchema(BaseModel):
    id: int
    user: UserSchema
    pet: PetSchema

    class Config:
        orm_mode = True
