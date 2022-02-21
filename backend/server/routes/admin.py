import jwt
import os
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server.schemas import UserSchema
from server.models import Code, User
from server.utils import get_db, get_settings
from server.config import Settings

router = APIRouter()

# TODO: Only administrator should be allowed to generate codes.
# TODO: Only administrator should be allowed to generate codes.
# TODO: Only administrator should be allowed to generate codes.
# TODO: rate limtier
# TODO: Volar todo esto a la recalcadisima concha de la lora.
# Habria que hacer un panel de control ahora que lo pienso 🤔 

@router.post('/generate_codes', status_code=201)
def generate_codes(db: Session = Depends(get_db)):
  codes = [Code()] * 50

  db.bulk_save_objects(codes)

  db.commit()

# PRIORITY
# PRIORITY
# Volar esto tambien.

@router.get('/jwt/{user_id}', status_code=201)
def get_user_jwt(
  user_id: int, 
  settings: Settings = Depends(get_settings),
  db: Session = Depends(get_db)
):
  user = db.query(User).filter(User.id == user_id).first()

  jwt_token = jwt.encode({
    "id": user.id,
    "uuid": str(user.uuid),
    "phone_verified": user.phone_verified,
    "exp": datetime.utcnow() + timedelta(days=10),
    "iat": datetime.utcnow()
    },
    settings.JWT_SECRET,
    algorithm="HS256"
  )

  return jwt_token