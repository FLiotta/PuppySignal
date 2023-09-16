import jwt
import requests

from datetime import datetime, timedelta
from fastapi import Request
from fastapi.exceptions import HTTPException
from fastapi.params import Depends, Header
from fastapi.routing import APIRouter
from simplelimiter import Limiter
from sqlalchemy.orm.session import Session

from server.schemas import OAuthGoogleResponse, GoogleOAuthBody, RefreshTokenResponse
from server.models import UserAuth, User, RefreshToken
from server.config import Settings
from server.utils import get_db, get_settings

router = APIRouter()

"""
  access_tokens must only have the next fields:

  @id: Int
  @uuid: UUIDv4
  @phone_verified: Boolean

  Not personal info should be in the token, it's only for validations purposes.
"""

# TODO: User shouldn't be allowed to access these endpoints if they're already authenticated.
# TODO: DB Transaction & Rollbacks.

@router.post(
  "/google", 
  response_model=OAuthGoogleResponse,
  dependencies=[Depends(Limiter("20/hour"))]
)
async def get_auth(
  request: Request,
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
    "uuid": str(user_to_serialize.uuid),
    "phone_verified": user_to_serialize.phone_verified,
    "exp": datetime.utcnow() + timedelta(minutes=10),
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
      "access_token": jwt_token,
      "refresh_token": refresh_token
    }
  }

# TODO: DB Transaction & Rollback.
# CRITICAL: Refresh token not being deleted when user signout.

@router.post(
  "/jwt/refresh", 
  response_model=RefreshTokenResponse,
  dependencies=[Depends(Limiter("10/hour"))]
)
async def jwt_refresh(
  request: Request,
  refresh_token: str = Header(...),
  settings: Settings = Depends(get_settings),
  db: Session = Depends(get_db)
):
  token = db.query(RefreshToken).filter(
    RefreshToken.token==refresh_token
  ).first()

  if not token:
    raise HTTPException(status_code=404, detail="Refresh token not found.")

  actual_time = datetime.date(datetime.utcnow())

  if type(token.valid_until) is datetime:
    valid_until = datetime.date(token.valid_until)
  else:
    valid_until = token.valid_until

  if actual_time > valid_until:
    raise HTTPException(status_code=400, detail="Expired refresh token.")

  user = token.user

  db.delete(token)

  access_token = jwt.encode({
    "id": user.id,
    "uuid": str(user.uuid),
    "phone_verified": user.phone_verified,
    "exp": datetime.utcnow() + timedelta(minutes=10),
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
      user_id=user.id,
      valid_until=new_refresh_token_expiration_time
    )
  )

  db.commit()

  return {
    "data": {
      "access_token": access_token,
      "refresh_token": new_refresh_token
    }
  }
