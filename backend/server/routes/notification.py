from firebase_admin import messaging
from fastapi import APIRouter, Depends
from simplelimiter import Limiter
from sqlalchemy.orm import Session

from server.models import FCMToken
from server.schemas import NotificationSuscribeBody, UserSchema
from server.utils import protected_route, get_user, get_db

router = APIRouter(
  dependencies=[Depends(protected_route)]#, Depends(Limiter("1/day"))]
)

@router.post("/suscribe_personal_topic")
def subscribe_notification(
  body: NotificationSuscribeBody,
  db: Session = Depends(get_db),
  user: UserSchema = Depends(get_user)
):
  user_fcm_token = db.query(FCMToken).filter(FCMToken.user_id == user["id"]).first()

  if not user_fcm_token:
    # Create FCMToken
    new_user_fcmtoken = FCMToken(
      user_id=user["id"],
      fcm_token=body.token
    )

    db.add(new_user_fcmtoken)
    db.commit()
  elif user_fcm_token.fcm_token != body.token:
    # Unsuscribe old token
    messaging.unsubscribe_from_topic(user_fcm_token.fcm_token, user["uuid"])
    # Update FCMToken
    user_fcm_token.fcm_token = body.token

    db.commit()
  else:
    # Already suscribed with updated token
    return None

  messaging.subscribe_to_topic(body.token, user["uuid"])

  return None

@router.post("/unsuscribe")
def unsubscribe_notification(body: NotificationSuscribeBody, user: UserSchema = Depends(get_user)):
  fcm_token = db.query(FCMToken).filter(FCMToken.user_id == user["id"]).first()

  if fcm_token:
    db.delete(fcm_token)
    db.commit()

  messaging.unsubscribe_from_topic(body.token, user["uuid"])
  return None