import jwt
import requests
import os

from datetime import datetime, timedelta
from typing import Any
from pydantic import BaseModel
from fastapi.exceptions import HTTPException
from fastapi.params import Depends
from fastapi.routing import APIRouter
from sqlalchemy.orm.session import Session
from sqlalchemy import select

from server.schemas import UserSchema
from server.models import UserAuth, User
from server.utils import get_db, protected_route

router = APIRouter()

class GoogleOAuthBody(BaseModel):
  token: str

@router.post("/google")
async def get_auth(body: GoogleOAuthBody, db: Session = Depends(get_db)):
  token: str = body.token

  response = requests.get(f"https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token={token}")

  if not response.ok:
    raise HTTPException(status_code=400, detail="Invalid token.")

  response_data = response.json()

  user_oauth = db.query(UserAuth)\
    .filter((UserAuth.method == "GOOGLE") & (UserAuth.oauth_id == response_data['id']))\
    .first()
  
  user_to_serialize = None

  if user_oauth is not None:
    user_to_serialize = user_oauth.user
  else:
    new_user_model = User(
      first_name=response_data['given_name'],
      last_name=response_data['family_name'],
      email=response_data['email'],
      profile_picture=response_data['picture']
    )

    new_user = db.add(new_user_model)

    new_user_auth_model = UserAuth(
      method="GOOGLE",
      oauth_id=response_data['id'],
      user_id=new_user.id
    )

    db.add(new_user_auth_model)

    user_to_serialize = new_user
  
  jwt_token = jwt.encode({
    **UserSchema.from_orm(user_to_serialize).dict(),
    "exp": datetime.utcnow() + timedelta(days=7)
    },
    os.environ.get('JWT_SECRET'),
    algorithm="HS256"
  )

  return {
    "data": {
      "token": jwt_token
    }
  }