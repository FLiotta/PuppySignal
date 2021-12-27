import jwt
import requests

from datetime import datetime, timedelta
from fastapi.exceptions import HTTPException
from fastapi.params import Depends
from fastapi.routing import APIRouter
from sqlalchemy.orm.session import Session

from server.schemas import UserSchema, OAuthGoogleResponse, GoogleOAuthBody
from server.models import UserAuth, User
from server.config import Settings
from server.utils import get_db, get_settings

router = APIRouter()

# User shouldn't be allowed to access these endpoints if they're already authenticated.

# TODO: rate limtier

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
    **UserSchema.from_orm(user_to_serialize).dict(),
    "uuid": str(user_to_serialize.uuid),
    "exp": datetime.utcnow() + timedelta(days=7)
    },
    settings.JWT_SECRET,
    algorithm="HS256"
  )

  return {
    "data": {
      "token": jwt_token
    }
  }