from pydantic import BaseModel

class UserNotificationSchema(BaseModel):
  id: str
  notification_id: int
  user_id: int

  class Config:
    orm_mode = True
