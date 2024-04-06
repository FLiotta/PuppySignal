import uuid
import datetime

from typing import Optional
from pydantic import BaseModel

from server.schemas.specie import SpecieSchema
from server.schemas.breed import BreedSchema


class PetSchema(BaseModel):
    id: int
    uuid: uuid.UUID
    name: str
    profile_picture: Optional[str]
    description: Optional[str]
    color: Optional[str]
    specie: Optional[SpecieSchema]
    breed: Optional[BreedSchema]
    lost_since: Optional[datetime.datetime]

    class Config:
        orm_mode = True
