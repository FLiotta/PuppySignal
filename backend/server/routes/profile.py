from typing import List

from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session, joinedload
from twilio.rest import Client

from server.models import User, Notification, Pet
from server.schemas import UserSchema, ProfileResponse, ProfilePatchBody, ProfilePetsResponse, PhoneNumberBody, PhoneNumberVerifyBody, NotificationWithPetSchema
from server.utils import get_db, protected_route, get_user, get_settings
from server.config import Settings

settings = get_settings()
router = APIRouter()
twilio = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

# TODO: rate limtier

@router.get("/", response_model=ProfileResponse, dependencies=[Depends(protected_route)])
def get_profile(db: Session = Depends(get_db), u: UserSchema = Depends(get_user)):
  user = db.query(User).filter(User.id == u["id"]).first()

  if not user:
    raise HTTPException(status_code=404, detail="Profile not found (wtf???).")

  return {
    "data": user
  }

# TODO: rate limtier

@router.patch("/", status_code=204, dependencies=[Depends(protected_route)])
def update_profile(body: ProfilePatchBody, db: Session = Depends(get_db), u: UserSchema = Depends(get_user)):
  if not body.first_name and not body.last_name:
    raise HTTPException(status_code=400, detail="You must provide atleast one parameter to update")

  user = db.query(User).filter(User.id == u["id"]).first()

  if body.first_name:
    user.first_name = body.first_name
  
  if body.last_name:
    user.last_name = body.last_name
  
  db.commit()

# TODO: rate limtier
# TODO: pagination?

@router.get("/pets", response_model=ProfilePetsResponse, dependencies=[Depends(protected_route)])
def get_user_pets(db: Session = Depends(get_db), u: UserSchema = Depends(get_user)):
  pets = db.query(Pet).filter(
    Pet.owners.any(id=u['id'])
  ).options(joinedload(Pet.specie)).all()

  return {
    "data": pets
  }

# TODO: rate limiter
# TODO: pagination?

@router.get("/notifications", response_model=List[NotificationWithPetSchema], dependencies=[Depends(protected_route)])
def get_user_notifications(db: Session = Depends(get_db), u: UserSchema = Depends(get_user)):
  notifications = db.query(Notification).filter(
    Notification.owners.any(id=u['id'])
  ).options(joinedload(Notification.pet)).all()

  return {
    "data": notifications
  }

# TODO: rate limiter

@router.post("/phone_number", status_code=200, dependencies=[Depends(protected_route)])
def request_phone_number_code(body: PhoneNumberBody, settings: Settings = Depends(get_settings)):
  verify = twilio.verify.services(settings.TWILIO_SERVICE_ID)

  try:
    verify.verifications.create(to=body.phone_number, channel='sms')
    return
  except Exception as e:
    return HTTPException(status_code=400, detail=e)
    
# TODO: rate limtier

@router.post("/phone_number/verify", status_code=200, dependencies=[Depends(protected_route)])
def verify_requested_phone_number_code(
  body: PhoneNumberVerifyBody, 
  db: Session = Depends(get_db), 
  u: UserSchema = Depends(get_user),
  settings: Settings = Depends(get_settings)
):
  verify = twilio.verify.services(settings.TWILIO_SERVICE_ID)

  try:
    verify.verification_checks.create(to=body.phone_number, code=body.code)

    user = db.query(User)\
      .filter(id=u['id'])\
      .first()

    user.update(
      phone_number = body.phone_number,
      validated_profile_phone_number = True
    )

    db.commit()
  except Exception as e:
    return HTTPException(status_code=400, detail=e)