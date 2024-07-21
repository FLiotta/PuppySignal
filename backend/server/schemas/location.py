from pydantic import BaseModel


class LocationSchema(BaseModel):
    id: int
    latitude: float
    longitude: float

    class Config:
        orm_mode = True
