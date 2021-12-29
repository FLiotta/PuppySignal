import jwt
import os

from functools import lru_cache

from fastapi import Header
from fastapi.param_functions import Depends
from fastapi.exceptions import HTTPException
from server.database import SessionLocal
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

async def get_user(token: str = Header(...), settings: config.Settings = Depends(get_settings)):
  decoded_user = jwt.decode(token, settings.JWT_SECRET, algorithms='HS256')
    
  return decoded_user

async def protected_route(token: str = Header(...), settings: config.Settings = Depends(get_settings)):
  if token is None:
    raise HTTPException(status_code=401, detail="Authorization token not found.")
  try:
    jwt.decode(token, settings.JWT_SECRET, algorithms='HS256')
    
    # TODO: Verify token isn't expired.
    pass
  except: 
    raise HTTPException(status_code=403, detail="Invalid JWT Token.")
 
async def fully_validated_user(token: str = Header(...), settings: config.Settings = Depends(get_settings)):
  if token is None:
    raise HTTPException(status_code=401, detail="Authorization token not found.")

  user = None

  try:
    user = jwt.decode(token, settings.JWT_SECRET, algorithms='HS256')
  except:
    raise HTTPException(status_code=403, detail="Invalid JWT Token.")

  if not user['validated_profile_phone_number']:
    raise HTTPException(status_code=401, detail="You must validate your phone number first.")

  pass
