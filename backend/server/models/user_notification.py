from sqlalchemy import Integer, ForeignKey, Column
from server.database import Base


class UserNotification(Base):
    __tablename__ = "user_notification"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    notification_id = Column(Integer, ForeignKey("notification.id"), nullable=False)
