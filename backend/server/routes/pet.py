import boto3
import cv2
import numpy

from typing import List

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, Request
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import DataError, IntegrityError

from server.schemas import (
  UserSchema, 
  ScannedQRCodeResponse, 
  PetByIdResponse, 
  PetCodesResponse, 
  PetLocationsResponse, 
  CreatePetSchema, 
  CreatePetLocationBody,
  UpdatePetBody
)
from server.utils import get_db, get_user, protected_route, get_settings, fully_validated_user, limiter
from server.config import Settings
from server.models import Pet, Code, UserPet, UserNotification, Notification, Location, PetLocation

router = APIRouter()

@router.post("/", response_model=CreatePetSchema, status_code=200, dependencies=[Depends(protected_route), Depends(fully_validated_user)])
@limiter("5/hour")
def create_pet(
  request: Request,
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
  # Create a QR Code for IT (In the future, QRS should be already created and assigned to it)
  # Assigns an owner
  # Saves and upload the image
  # Assigns the image path to pet
  try:
    # TODO: Aca hubo cambio, validar que siga funcionando
    # from bubffer de fromstring
    uploaded_pet_avatar = cv2.imdecode(numpy.frombuffer(memoryview(file.file.read()), numpy.uint8), cv2.IMREAD_UNCHANGED)
  except Exception as e:
    raise HTTPException(status_code=400, detail="Error reading image")
  
  h = uploaded_pet_avatar.shape[0]
  w = uploaded_pet_avatar.shape[1]

  print((h, w))
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

      code = Code(pet_id=new_pet.id)

      db.add(code)

      new_user_pet = UserPet(
        pet_id=new_pet.id,
        user_id=u['id']
      )

      db.add(new_user_pet)
      db.flush()

      avatar_key = f"pets/{new_pet.uuid}.jpg"

      new_pet.profile_picture = f"{settings.b2_endpoint_url}/{settings.b2_bucket}/{avatar_key}"
      #TODO aca hubo cambio, validar que siga funcionando (.TOBYTES FROM TOSTRING)
      to_upload_pet_avatar = cv2.imencode('.jpg', uploaded_pet_avatar)[1].tobytes()
      
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
      print(e, flush=True)
      raise HTTPException(status_code=500, detail="Pet can't be created.")


@router.get("/{pet_id}", response_model=PetByIdResponse, dependencies=[Depends(protected_route)])
@limiter("5/minute")
def get_pet_by_id(
  request: Request,
  pet_id: int, 
  db: Session = Depends(get_db), 
  u = Depends(get_user)
):
  pet = (
    db.query(Pet)
      .filter((Pet.id == pet_id) & (Pet.owners.any(id=u['id'])))
      .options(joinedload(Pet.specie))
      .first()
  )

  if not pet:
    raise HTTPException(status_code=404, detail="Pet not found")

  return {
    "data": pet
  }

@router.patch("/{pet_id}", status_code=200, dependencies=[Depends(protected_route)])
@limiter("5/minute")
def get_pet_by_id(
  request: Request,
  body: UpdatePetBody,
  pet_id: int, 
  db: Session = Depends(get_db), 
  u = Depends(get_user)
):
  if not body.name and not body.extra and not body.specie_id:
    raise HTTPException(status_code=400, detail="Params not provided.")

  pet = (
    db.query(Pet)
      .filter((Pet.id == pet_id) & (Pet.owners.any(id=u['id'])))
      .options(joinedload(Pet.specie))
      .first()
  )

  if not pet:
    raise HTTPException(status_code=404, detail="Pet not found")

  try:
    if body.name:
      pet.name = body.name

    if body.extra:
      pet.extra = body.extra

    if body.specie_id:
      pet.specie_id = body.specie_id

    db.commit()
  except IntegrityError as e:
    raise HTTPException(status_code=400, detail="Invalid specie_id")
  except DataError as e:
    error_message = e.args[0]

    if "value too long" in error_message:
      raise HTTPException(status_code=400, detail="Value too long")
    
    raise HTTPException(status_code=400, detail="Invalid parameters")
  

@router.delete("/{pet_id}", status_code=200, dependencies=[Depends(protected_route), Depends(fully_validated_user)])
@limiter("5/minute")
def delete_pet_by_id(
  request: Request,
  pet_id: int,
  db: Session = Depends(get_db),
  u = Depends(get_user)
):
  pet = (
    db.query(Pet)
      .filter((Pet.id == pet_id) & (Pet.owners.any(id=u['id'])))
      .first()
  )

  if not pet:
    raise HTTPException(status_code=400, detail="Request cannot be fullfiled.")

  db.delete(pet)

  db.commit()

@router.get("/{pet_id}/codes", response_model=PetCodesResponse, dependencies=[Depends(protected_route)])
@limiter("5/minute")
def get_pet_by_id(
  request: Request,
  pet_id: int, 
  limit: int = 5,
  offset: int = 0,
  db: Session = Depends(get_db), 
  u = Depends(get_user)
):
  # Nose cuantos codigos puede tener asociado una mascota, supongo que paginas de 5 seran suficientes.
  pet = (
    db.query(Pet)
    .filter((Pet.id == pet_id) & (Pet.owners.any(id=u['id'])))
    .limit(limit)
    .offset(offset)
    .first()
  )

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


# TODO: Pagination
# ¿Deberian traerse todas las localizaciones o paginado?
# ¿Tal vez que se vayan cargando dependiendo donde scrollea el mapa?
# En ese caso la paginacion seria un poco mas complicada. Por el momento, que devuelva todas.

# TEMPORAL_FIX: Limit 50 hardcoded.
@router.get("/{pet_id}/locations", response_model=PetLocationsResponse, dependencies=[Depends(protected_route)])
@limiter("5/minute")
def get_pet_by_id(
  request: Request,
  pet_id: int, 
  db: Session = Depends(get_db), 
  u = Depends(get_user)
):
  pet = (
    db.query(Pet)
      .filter((Pet.id == pet_id) & (Pet.owners.any(id=u['id'])))
      .limit(50) 
      .first()
  )

  if not pet:
    raise HTTPException(status_code=404, detail="Pet not found")

  return {
    "data": pet.locations
  }

# TODO: RATE LIMITER

@router.post("/{pet_id}/locations")
def create_pet_location(
  request: Request,
  pet_id: int,
  body: CreatePetLocationBody,
  db: Session = Depends(get_db)
):
  code = (
     db.query(Code)
      .filter((Code.code == body.qr_code) & (Code.pet_id == pet_id))
      .first()
  )

  if not code:
    raise HTTPException(status_code=404, detail="Invalid pet_id or code")

  new_location = Location(latitude=body.lat, longitude=body.lng)

  db.add(new_location)
  db.commit()
  
  new_pet_location = PetLocation(
    pet_id=pet_id,
    location_id=new_location.id,
    method="SCANNED"
  )

  db.add(new_pet_location)
  db.commit()
  

  return {
    "data": new_location
  }

  
# TODO: Validar RATE LIMITER

@router.get("/scanned/{qr_code}", response_model=ScannedQRCodeResponse)
@limiter("5/hour")
def scan_qr_code(
  request: Request,
  qr_code: str, 
  db: Session = Depends(get_db)
):
  code = (
    db.query(Code)
    .filter(Code.code == qr_code)
    .options(joinedload(Code.pet).joinedload(Pet.owners))
    .first()
  )

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