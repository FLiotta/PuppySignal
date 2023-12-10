from pydantic import BaseModel


class BreedSchema(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
