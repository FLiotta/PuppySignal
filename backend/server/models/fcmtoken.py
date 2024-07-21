from datetime import datetime

from sqlalchemy import Column, Integer, ForeignKey, String, Date
from server.database import Base


class FCMToken(Base):
    __tablename__ = "fcmtoken"

    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    fcm_token = Column(String(256), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"))
    created_at = Column(Date, default=datetime.now, nullable=False)
    updated_at = Column(Date, default=datetime.now, nullable=False)

    def __str__(self):
        return f"[User {self.user_id}] RCM Token {self.rcm_token} ({self.updated_at} last updated)"
