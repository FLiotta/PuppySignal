from pydantic import BaseModel

class UserAuthSchema(BaseModel):
  id: str
  method: str
  oauth_id: str
  user_id: int

  class Config:
    orm_mode = True
