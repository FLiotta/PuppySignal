from pydantic import BaseModel

class SpecieSchema(BaseModel):
  id: int
  name: str

  class Config:
    orm_mode = True