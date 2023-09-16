from firebase_admin import messaging
from fastapi import APIRouter, Depends
from simplelimiter import Limiter

from server.schemas import NotificationSuscribeBody, UserSchema
from server.utils import protected_route, get_user

router = APIRouter(
  dependencies=[Depends(protected_route), Depends(Limiter("1/day"))]
)


@router.post("/suscribe", )
def subscribe_notification(body: NotificationSuscribeBody, u: UserSchema = Depends(get_user)):
  # TODO VALIDATE TOKEN
  messaging.subscribe_to_topic(body.token, u["uuid"])

  return None

@router.post("/unsuscribe")
def unsubscribe_notification(body: NotificationSuscribeBody, u: UserSchema = Depends(get_user)):
  messaging.unsubscribe_from_topic(body.token, u["uuid"])

  return None