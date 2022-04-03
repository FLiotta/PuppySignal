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

  if not user['phone_verified']:
    raise HTTPException(status_code=401, detail="You must validate your phone number first.")

  pass

def limiter(request_slash_timeunit: str):
  # CRITICAL TODO: Implement token bucket and a global limiter.

  """
    @params request_slash_timeunit: How many requests we want to allow per a certain timeunit (5/minute | 1200/hour)
  """
  time_equivalent_in_seconds = {
    "second": 1,
    "minute": 60,
    "hour": 3600,
    "day": 86400
  }

  # timeunits: [request, timeunit]
  timeunits = request_slash_timeunit.split("/")

  request_per_time = int(timeunits[0])
  exp_time = time_equivalent_in_seconds[timeunits[1]]

  def decorator(endpoint):
    @wraps(endpoint)
    def wrapper(*args, **kwargs):
      request: Request = kwargs["request"]
      user_data: JWTPayload = kwargs.get("u", None)  

      # Identifier: IP|UUID:PING:PATH
      # IP in case the endpoints doesnt require client to be authenticated, uuid in case it does.
      identifier = f"{request.client.host if not user_data else user_data['uuid']}:PING:{request.url.path}"

      requested_by_client = redis.incr(identifier)

      if requested_by_client == 1:
        redis.expire(identifier, exp_time)
        ttl = exp_time
      else:
        ttl = redis.ttl(identifier)

      if requested_by_client > request_per_time:
        pass # TODO UNCOMMENT THIS ONLY DEBUG
        #raise HTTPException(status_code=429)

      return endpoint(*args, **kwargs)
    
    return wrapper
  return decorator