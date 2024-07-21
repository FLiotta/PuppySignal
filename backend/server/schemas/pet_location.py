from typing import Optional
from pydantic import BaseModel


class PetLocationSchema(BaseModel):
    id: str
    pet_id: int
    location_id: str
    method: Optional[str]

    class Config:
        orm_mode = True
