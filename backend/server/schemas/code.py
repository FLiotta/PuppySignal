from typing import Optional
from pydantic import BaseModel
from server.schemas.pet import PetSchema


class CodeSchema(BaseModel):
    id: int
    code: str

    class Config:
        orm_mode = True


class CodeWithPetSchema(BaseModel):
    id: int
    code: str
    pet: Optional[PetSchema]
