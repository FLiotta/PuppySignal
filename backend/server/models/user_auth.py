from datetime import datetime
from sqlalchemy import Integer, String, Date, ForeignKey, Column

from server.database import Base

class UserAuth(Base):
  __tablename__ = "user_auth"
  id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
  oauth_id = Column(String(50), nullable=False)
  method = Column(String(50), nullable=False)
  user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
  created_at = Column(Date, default=datetime.now, nullable=False)
  updated_at = Column(Date, default=datetime.now, nullable=False)