from sqlalchemy import Column, String, ForeignKey, Integer, Date
from sqlalchemy.orm import relationship
from server.database import Base

class RefreshToken(Base):
  __tablename__ = "refresh_token"

  id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
  token = Column(String(2000), unique=True, nullable=False)
  user_id = Column(Integer, ForeignKey('user.id'))
  valid_until = Column(Date, nullable=False)

  user = relationship("User")

  def __str__(self):
    return f"<refresh_token user_id={self.user_id} valid_until={self.valid_until}>"