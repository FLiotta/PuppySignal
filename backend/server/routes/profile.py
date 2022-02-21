from typing import List

from fastapi import APIRouter, Depends, Request
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session, joinedload
from twilio.rest import Client

from server.models import User, Notification, Pet
from server.schemas import UserSchema, ProfileResponse, ProfilePatchBody, ProfilePetsResponse, PhoneNumberBody, PhoneNumberVerifyBody, ProfileNotificationsResponse
from server.utils import get_db, protected_route, get_user, get_settings, limiter
from server.config import Settings

settings = get_settings()
router = APIRouter()
twilio = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

@router.get("/", response_model=ProfileResponse, dependencies=[Depends(protected_route)])
@limiter('5/hour')
def get_profile(
  request: Request,
  db: Session = Depends(get_db), 
  u: UserSchema = Depends(get_user)
):
  user = db.query(User).filter(User.id == u["id"]).first()

  if not user:
    raise HTTPException(status_code=404, detail="Profile not found.")

  return {
    "data": user
  }


@router.patch("/", status_code=200, dependencies=[Depends(protected_route)])
@limiter("1/day")
def update_profile(
  body: ProfilePatchBody, 
  request: Request,
  db: Session = Depends(get_db), 
  u: UserSchema = Depends(get_user)
):
  if not body.first_name and not body.last_name:
    raise HTTPException(status_code=400, detail="You must provide atleast one parameter to update")

  user = db.query(User).filter(User.id == u["id"]).first()

  if body.first_name:
    user.first_name = body.first_name

  if body.last_name:
    user.last_name = body.last_name

  db.commit()


@router.get("/pets", response_model=ProfilePetsResponse, dependencies=[Depends(protected_route)])
@limiter("5/minute")
def get_user_pets(
  request: Request,
  limit: int = 5,
  offset: int = 0,
  db: Session = Depends(get_db), 
  u: UserSchema = Depends(get_user)
):
  pets = (
    db.query(Pet)
      .filter(Pet.owners.any(id=u['id']))
      .limit(limit)
      .offset(offset)
      .options(joinedload(Pet.specie))
      .all()
  )

  return {
    "data": pets
  }


@router.get("/notifications", response_model=ProfileNotificationsResponse, dependencies=[Depends(protected_route)])
@limiter("5/minute")
def get_user_notifications(
  request: Request,
  limit: int = 5,
  offset: int = 0,
  db: Session = Depends(get_db), 
  u: UserSchema = Depends(get_user)
):
  notifications = (
    db.query(Notification)
    .filter(Notification.owners.any(id=u['id']))
    .limit(limit)
    .offset(offset)
    .options(joinedload(Notification.pet))
    .all()
  )

  return {
    "data": notifications
  }


@router.post("/phone_number", status_code=200, dependencies=[Depends(protected_route)])
@limiter("3/hour")
def request_phone_number_code(
  request: Request,
  body: PhoneNumberBody, 
  settings: Settings = Depends(get_settings)
):
  verify = twilio.verify.services(settings.TWILIO_SERVICE_ID)

  try:
    verify.verifications.create(to=body.phone_number, channel='sms')
    return
  except Exception as e:
    return HTTPException(status_code=400, detail=e)


@router.post("/phone_number/verify", status_code=200, dependencies=[Depends(protected_route)])
@limiter("3/hour")
def verify_requested_phone_number_code(
  request: Request,
  body: PhoneNumberVerifyBody,
  db: Session = Depends(get_db),
  u: UserSchema = Depends(get_user),
  settings: Settings = Depends(get_settings)
):
  verify = twilio.verify.services(settings.TWILIO_SERVICE_ID)

  try:
    verify.verification_checks.create(to=body.phone_number, code=body.code)

    user = db.query(User).get(u['id'])

    user.phone_number = body.phone_number
    user.phone_verified = True

    db.commit()
  except Exception as e:
    return HTTPException(status_code=400, detail=e)
