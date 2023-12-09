import jwt
import requests

from datetime import datetime, timedelta
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


def generate_jwt(user_id: int, user_uuid: str, exp: datetime, key: str):
    """
    access_tokens must only have the next fields:

    @id: Int
    @uuid: UUIDv4

    Not personal info should be in the token, it's only for validations purposes.
    """

    payload = {"id": user_id, "uuid": user_uuid, "exp": exp, "iat": datetime.utcnow()}

    return jwt.encode(payload, key, algorithm="HS256")


@router.post(
    "/google",
    response_model=OAuthGoogleResponse,
    dependencies=[Depends(Limiter("20/hour"))],
)
async def get_auth(
    body: GoogleOAuthBody,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    token: str = body.token

    response = requests.get(
        f"https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token={token}"
    )

    if not response.ok:
        raise HTTPException(status_code=400, detail="Invalid google token.")

    response_data = response.json()

    user_oauth = (
        db.query(UserAuth)
        .filter(
            (UserAuth.method == "GOOGLE") & (UserAuth.oauth_id == response_data["id"])
        )
        .first()
    )

    user_to_serialize = None

    if user_oauth is not None:
        user_to_serialize = user_oauth.user
    else:
        try:
            new_user = User(
                first_name=response_data["given_name"],
                last_name=response_data["family_name"],
                email=response_data["email"],
                profile_picture=response_data["picture"],
            )

            db.add(new_user)

            db.flush()

            db.refresh(new_user)

            new_user_auth = UserAuth(
                method="GOOGLE", oauth_id=response_data["id"], user_id=new_user.id
            )

            db.add(new_user_auth)
            db.commit()

            user_to_serialize = new_user
        except Exception:
            raise HTTPException(status_code=500, detail="User cannot be created.")

    access_token = generate_jwt(
        user_id=user_to_serialize.id,
        user_uuid=str(user_to_serialize.uuid),
        exp=datetime.utcnow() + timedelta(minutes=10),
        key=settings.JWT_SECRET,
    )

    refresh_token_expiration_time = datetime.utcnow() + timedelta(days=7)
    refresh_token = generate_jwt(
        user_id=user_to_serialize.id,
        user_uuid=str(user_to_serialize.uuid),
        exp=refresh_token_expiration_time,
        key=settings.JWT_SECRET,
    )

    db.add(
        RefreshToken(
            token=refresh_token,
            user_id=user_to_serialize.id,
            valid_until=refresh_token_expiration_time,
        )
    )

    db.commit()

    return {"data": {"access_token": access_token, "refresh_token": refresh_token}}


@router.post(
    "/jwt/refresh",
    response_model=RefreshTokenResponse,
    dependencies=[Depends(Limiter("10/hour"))],
)
async def refresh_json_web_token(
    refresh_token: str = Header(...),
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    # We check if the refresh token exists on the database and validate if its expired
    saved_token = (
        db.query(RefreshToken).filter(RefreshToken.token == refresh_token).first()
    )

    if not saved_token:
        raise HTTPException(status_code=404, detail="Refresh token not found.")

    current_time = datetime.date(datetime.utcnow())

    if type(saved_token.valid_until) is datetime:
        valid_until = datetime.date(saved_token.valid_until)
    else:
        valid_until = saved_token.valid_until

    # If the token is expired, we just delete it, user will have to auth again.
    if current_time > valid_until:
        db.delete(saved_token)
        db.commit()

        raise HTTPException(status_code=400, detail="Expired refresh token.")

    access_token = generate_jwt(
        user_id=saved_token.user.id,
        user_uuid=str(saved_token.user.uuid),
        exp=datetime.utcnow() + timedelta(minutes=10),
        key=settings.JWT_SECRET,
    )

    return {"data": {"access_token": access_token}}
