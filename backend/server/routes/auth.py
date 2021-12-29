import jwt
import requests

from datetime import datetime, timedelta
from fastapi.exceptions import HTTPException
from fastapi.params import Depends, Header
from fastapi.routing import APIRouter
from sqlalchemy.orm.session import Session

from server.schemas import UserSchema, OAuthGoogleResponse, GoogleOAuthBody, RefreshTokenResponse
from server.models import UserAuth, User, RefreshToken
from server.config import Settings
from server.utils import get_db, get_settings

router = APIRouter()

# User shouldn't be allowed to access these endpoints if they're already authenticated.

# TODO: rate limtier
# TODO: DB Transaction & Rollbacks.

@router.post("/google", response_model=OAuthGoogleResponse)
async def get_auth(
  body: GoogleOAuthBody,
  settings: Settings = Depends(get_settings),
  db: Session = Depends(get_db)
):
  token: str = body.token

  response = requests.get(f"https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token={token}")

  if not response.ok:
    raise HTTPException(status_code=400, detail="Invalid google token.")

  response_data = response.json()

  user_oauth = db.query(UserAuth)\
    .filter((UserAuth.method == "GOOGLE") & (UserAuth.oauth_id == response_data['id']))\
    .first()
  
  user_to_serialize = None

  if user_oauth is not None:
    user_to_serialize = user_oauth.user
  else:
    try:
      new_user = User(
        first_name=response_data['given_name'],
        last_name=response_data['family_name'],
        email=response_data['email'],
        profile_picture=response_data['picture']
      )

      db.add(new_user)

      db.flush()

      db.refresh(new_user)

      new_user_auth = UserAuth(
        method="GOOGLE",
        oauth_id=response_data['id'],
        user_id=new_user.id
      )
      
      db.add(new_user_auth)
      db.commit()

      user_to_serialize = new_user
    except Exception as e:
      raise HTTPException(status_code=500, detail="User cannot be created.")
    
  jwt_token = jwt.encode({
    "id": user_to_serialize.id,
    "validated_phone_number": user_to_serialize.validated_profile_phone_number,
    "uuid": str(user_to_serialize.uuid),
    "exp": datetime.utcnow() + timedelta(minutes=5),
    "iat": datetime.utcnow()
    },
    settings.JWT_SECRET,
    algorithm="HS256"
  )

  refresh_token_expiration_time = datetime.utcnow() + timedelta(days=31)
  refresh_token = jwt.encode({
    "exp": refresh_token_expiration_time,
    "iat": datetime.utcnow()
    },
    settings.JWT_SECRET,
    algorithm="HS256"
  )

  db.add(
    RefreshToken(
      token=refresh_token,
      user_id=user_to_serialize.id,
      valid_until=refresh_token_expiration_time
    )
  )

  db.commit()

  return {
    "data": {
      "token": jwt_token,
      "refresh_token": refresh_token
    }
  }

# TODO: DB Transaction & Rollback.

@router.post("/jwt/refresh", response_model=RefreshTokenResponse)
async def jwt_refresh(
  refresh_token: str = Header(...),
  settings: Settings = Depends(get_settings),
  db: Session = Depends(get_db)
):
  token = db.query(RefreshToken).filter(
    RefreshToken.token==refresh_token
  ).first()

  actual_time = datetime.date(datetime.utcnow())

  if not token:
    raise HTTPException(status_code=404, detail="Refresh token not found.")
  elif actual_time > token.valid_until:
    raise HTTPException(status_code=400, detail="Expired refresh token.")
  
  user_id = token.user.id

  db.delete(token)

  access_token = jwt.encode({
    "user_id": str(user_id),
    "exp": datetime.utcnow() + timedelta(minutes=5),
    "iat": datetime.utcnow()
    },
    settings.JWT_SECRET,
    algorithm="HS256"
  )

  new_refresh_token_expiration_time = datetime.utcnow() + timedelta(days=31)
  new_refresh_token = jwt.encode({
    "exp": new_refresh_token_expiration_time,
    "iat": datetime.utcnow()
    },
    settings.JWT_SECRET,
    algorithm="HS256"
  )

  db.add(
    RefreshToken(
      token=new_refresh_token,
      user_id=user_id,
      valid_until=new_refresh_token_expiration_time
    )
  )

  db.commit()

  return {
    "data": {
      "token": access_token,
      "refresh_token": new_refresh_token
    }
  }