import boto3
import cv2
import numpy

from typing import List

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session, joinedload

from server.schemas import PetSchema, CodeSchema, LocationSchema, UserSchema, ScannedQRCodeResponse
from server.utils import get_db, get_user, protected_route, get_settings
from server.config import Settings
from server.models import Pet, Code, UserPet, UserNotification, Notification

router = APIRouter()

# TODO: rate limiter

@router.post("/", response_model=PetSchema, dependencies=[Depends(protected_route)])
async def create_pet(
  file: UploadFile = File(...),
  name: str = Form(...),
  description: str = Form(...),
  specie_id: int = Form(...),
  db: Session = Depends(get_db),
  settings: Settings = Depends(get_settings),
  u: UserSchema = Depends(get_user)
):
  # Validates image sizes, it must be less than 640x640 and must be 1:1 aspect ratio.
  # Creates the pet
  # Assigns an empty QR to it
  # Assigns an owner
  # Saves and upload the image
  # Assigns the image path to pet
  try:
    uploaded_pet_avatar = cv2.imdecode(numpy.fromstring(file.file.read(), numpy.uint8), cv2.IMREAD_UNCHANGED)
  except Exception as e:
    raise HTTPException(status_code=400, detail="Error reading image")
  
  h, w, _ = uploaded_pet_avatar.shape

  if h > 640 or w > 640:
    raise HTTPException(status_code=400, detail="Image can't be larger than 640x640")
  elif h % w != 0:
    raise HTTPException(status_code=400, detail="Pet avatar must be 1:1 aspect ratio.")
  
  try:
    s3 = boto3.client('s3',
      endpoint_url=settings.b2_endpoint_url,
      aws_access_key_id = settings.b2_application_key_id,
      aws_secret_access_key=settings.b2_application_key
    )
  except Exception as e:
    raise HTTPException(status_code=500, detail="Cannot initialize s3.")

  with db.begin():
    try:
      new_pet = Pet(
        name=name,
        extra=description,
        specie_id=specie_id
      )

      db.add(new_pet)
      db.flush()

      empty_code = db.query(Code).filter(Code.pet_id == None).first()
      empty_code.pet_id = new_pet.id

      new_user_pet = UserPet(
        pet_id=new_pet.id,
        user_id=u['id']
      )

      db.add(new_user_pet)
      db.flush()

      avatar_key = f"pets/{new_pet.uuid}.jpg"

      new_pet.profile_picture = f"{settings.b2_endpoint_url}/{settings.b2_bucket}/{avatar_key}"

      to_upload_pet_avatar = cv2.imencode('.jpg', uploaded_pet_avatar)[1].tostring()

      s3.put_object(
        Bucket=settings.b2_bucket,
        Key=avatar_key,
        Body=to_upload_pet_avatar
      )

      db.commit()

      return {
        "data": new_pet
      }
    except Exception as e:
      db.rollback()
      raise HTTPException(status_code=500, detail="Pet can't be created.")

# TODO: rate limiter

@router.get("/{pet_id}", response_model=PetSchema, dependencies=[Depends(protected_route)])
def get_pet_by_id(pet_id: int, db: Session = Depends(get_db),  u = Depends(get_user)):
  pet = db.query(Pet).filter(
    (Pet.id == pet_id) & (Pet.owners.any(id=u['id']))
  ).first()

  if not pet:
    raise HTTPException(status_code=404, detail="Pet not found")

  return {
    "data": pet
  }

# TODO: rate limiter
# TODO: pagination?

@router.get("/{pet_id}/codes", response_model=List[CodeSchema], dependencies=[Depends(protected_route)])
def get_pet_by_id(pet_id: int, db: Session = Depends(get_db),  u = Depends(get_user)):
  pet = db.query(Pet).filter(
    (Pet.id == pet_id) & (Pet.owners.any(id=u['id']))
  ).first()

  if not pet:
    raise HTTPException(status_code=404, detail="Pet not found")

  parsed_codes = []

  for code in pet.codes:
    parsed_codes.append({
      "id": code.id,
      "code": code.code
    })

  return {
    "data": parsed_codes
  }

# TODO: rate limiter

@router.get("/{pet_id}/locations", response_model=List[LocationSchema], dependencies=[Depends(protected_route)])
def get_pet_by_id(pet_id: int, db: Session = Depends(get_db),  u = Depends(get_user)):
  pet = db.query(Pet) \
    .filter((Pet.id == pet_id) & (Pet.owners.any(id=u['id']))) \
    .first()

  if not pet:
    raise HTTPException(status_code=404, detail="Pet not found")

  return {
    "data": pet.locations
  }

  
# TODO: rate limiter (QR special case)

@router.get("/scanned/{qr_code}", response_model=ScannedQRCodeResponse)
def scan_qr_code(qr_code: str, db: Session = Depends(get_db)):
  code = db.query(Code).filter(Code.code == qr_code).options(
      joinedload(Code.pet).joinedload(Pet.owners)
    ).first()

  db.close()

  with db.begin():
    try:
      new_notification = Notification(
        type="SCANNED",
        scanned_pet_id=code.pet.id
      )
      db.add(new_notification)
      db.flush()

      for owner in code.pet.owners:
        new_user_notification = UserNotification(
          user_id=owner.id,
          notification_id=new_notification.id
        )

        db.add(new_user_notification)
      
      db.commit()

      # TODO Send push notification
      # ...
      # TODO Send email
      # ...

      return {
        "data": code.pet
      }
    except Exception as e:
      db.rollback()
      raise HTTPException(status_code=500, detail="QR Code can't be scanned.")