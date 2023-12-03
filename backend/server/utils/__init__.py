import jwt
import redis as redis_pkg

from functools import lru_cache, wraps
from jwt.exceptions import ExpiredSignatureError

from fastapi import Header, Request
from fastapi.param_functions import Depends
from fastapi.exceptions import HTTPException

from server.database import SessionLocal
from server.schemas import JWTPayload
from server import config

def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()

@lru_cache()
def get_settings() -> config.Settings:
    return config.Settings()

settings = get_settings()

redis = redis_pkg.Redis(host=settings.redis_host, port=settings.redis_port)

async def get_user(token: str = Header(...), settings: config.Settings = Depends(get_settings)):
  decoded_user = jwt.decode(token, settings.JWT_SECRET, algorithms='HS256')
    
  return decoded_user

async def protected_route(token: str = Header(...), settings: config.Settings = Depends(get_settings)):
  if token is None:
    raise HTTPException(status_code=401, detail="Authorization token not found.")
  try:
    jwt.decode(token, settings.JWT_SECRET, algorithms='HS256')

    pass
  except ExpiredSignatureError:
    raise HTTPException(status_code=403, detail="Expired token.")
  except: 
    raise HTTPException(status_code=403, detail="Invalid Token.")

async def fully_validated_user(token: str = Header(...), settings: config.Settings = Depends(get_settings)):
  if token is None:
    raise HTTPException(status_code=401, detail="Authorization token not found.")

  user = None

  try:
    user = jwt.decode(token, settings.JWT_SECRET, algorithms='HS256')
  except:
    raise HTTPException(status_code=403, detail="Invalid JWT Token.")

  pass
