import boto3
import cv2
import numpy

from datetime import datetime
from typing import List, Optional
from simplelimiter import Limiter
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import DataError, IntegrityError
from server.models.breed import Breed

from server.schemas.user import UserSchema
from server.schemas.pet import PetSchema
from server.schemas.code import CodeSchema
from server.schemas.location import LocationSchema
from server.schemas.services import UpdatePetBody
from server.utils import get_db, get_user, protected_route, get_settings
from server.config import Settings
from server.models import Pet, Code, UserPet

router = APIRouter()


@router.post(
    "/",
    response_model=PetSchema,
    status_code=200,
    dependencies=[Depends(protected_route), Depends(Limiter("20/hour"))],
)
def create_pet(
    file: UploadFile = File(...),
    name: str = Form(...),
    description: str = Form(...),
    specie_id: int = Form(...),
    breed_id: Optional[int] = Form(None),
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
    u: UserSchema = Depends(get_user),
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
        uploaded_pet_avatar = cv2.imdecode(
            numpy.frombuffer(memoryview(file.file.read()), numpy.uint8),
            cv2.IMREAD_UNCHANGED,
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Error reading image")

    h = uploaded_pet_avatar.shape[0]
    w = uploaded_pet_avatar.shape[1]

    if h > 640 or w > 640:
        raise HTTPException(
            status_code=400, detail="Image can't be larger than 640x640"
        )
    elif h % w != 0:
        raise HTTPException(
            status_code=400, detail="Pet avatar must be 1:1 aspect ratio."
        )

    try:
        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.aws_application_key_id,
            aws_secret_access_key=settings.aws_application_key,
        )
    except Exception:
        raise HTTPException(status_code=500, detail="Cannot initialize s3.")

    with db.begin():
        if breed_id is not None:
            breed = db.query(Breed).filter_by(id=breed_id, specie_id=specie_id).first()

            if breed is None:
                raise HTTPException(
                    status_code=400, detail="Given breed doesn't belong to this specie"
                )

        try:
            new_pet = Pet(
                name=name, extra=description, specie_id=specie_id, breed_id=breed_id
            )

            db.add(new_pet)
            db.flush()

            code = Code(pet_id=new_pet.id)

            db.add(code)

            new_user_pet = UserPet(pet_id=new_pet.id, user_id=u["id"])

            db.add(new_user_pet)
            db.flush()

            avatar_key = f"{new_pet.uuid}.jpg"

            new_pet.profile_picture = avatar_key
            # TODO aca hubo cambio, validar que siga funcionando (.TOBYTES FROM TOSTRING)
            to_upload_pet_avatar = cv2.imencode(".jpg", uploaded_pet_avatar)[
                1
            ].tobytes()
            s3.put_object(
                Bucket=settings.s3_bucket, Key=avatar_key, Body=to_upload_pet_avatar
            )

            db.commit()

            return new_pet
        except Exception:
            db.rollback()
            raise HTTPException(status_code=500, detail="Pet can't be created.")


@router.get(
    "/{pet_id}",
    response_model=PetSchema,
    dependencies=[Depends(protected_route), Depends(Limiter("5/minute"))],
)
def get_pet_by_id(pet_id: int, db: Session = Depends(get_db), u=Depends(get_user)):
    pet = (
        db.query(Pet)
        .filter((Pet.id == pet_id) & (Pet.owners.any(id=u["id"])))
        .options(joinedload(Pet.specie))
        .options(joinedload(Pet.breed))
        .first()
    )

    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    return pet


@router.patch(
    "/{pet_id}",
    status_code=200,
    dependencies=[Depends(protected_route), Depends(Limiter("5/minute"))],
)
def update_get_pet_by_id(
    body: UpdatePetBody, pet_id: int, db: Session = Depends(get_db), u=Depends(get_user)
):
    if not body.name and not body.extra and not body.specie_id:
        raise HTTPException(status_code=400, detail="Params not provided.")

    pet = (
        db.query(Pet).filter((Pet.id == pet_id) & (Pet.owners.any(id=u["id"]))).first()
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
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Invalid specie_id")
    except DataError as e:
        if "value too long" in e.args[0]:
            raise HTTPException(status_code=400, detail="Value too long")

        raise HTTPException(status_code=400, detail="Invalid parameters")


@router.delete(
    "/{pet_id}",
    status_code=200,
    dependencies=[
        Depends(protected_route),
        Depends(Limiter("5/minute")),
    ],
)
def delete_pet_by_id(pet_id: int, db: Session = Depends(get_db), u=Depends(get_user)):
    pet = (
        db.query(Pet).filter((Pet.id == pet_id) & (Pet.owners.any(id=u["id"]))).first()
    )

    if not pet:
        raise HTTPException(status_code=400, detail="Request cannot be fullfiled.")

    db.delete(pet)

    db.commit()


@router.put(
    "/{pet_id}/lost",
    dependencies=[Depends(protected_route), Depends(Limiter("5/minute"))],
)
def toggle_pet_lost_since(
    pet_id: int, db: Session = Depends(get_db), u=Depends(get_user)
):
    pet = (
        db.query(Pet).filter((Pet.id == pet_id) & (Pet.owners.any(id=u["id"]))).first()
    )

    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    if pet.lost_since:
        pet.lost_since = None
    else:
        pet.lost_since = datetime.now()

    db.commit()


@router.get(
    "/{pet_id}/codes",
    response_model=List[CodeSchema],
    dependencies=[Depends(protected_route), Depends(Limiter("5/minute"))],
)
def get_pet_codes_by_id(
    pet_id: int,
    db: Session = Depends(get_db),
    u=Depends(get_user),
):
    pet = (
        db.query(Pet).filter((Pet.id == pet_id) & (Pet.owners.any(id=u["id"]))).first()
    )

    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    parsed_codes = []

    for code in pet.codes:
        parsed_codes.append({"id": code.id, "code": code.code})

    return parsed_codes


@router.get(
    "/{pet_id}/locations",
    response_model=List[LocationSchema],
    dependencies=[Depends(protected_route), Depends(Limiter("5/minute"))],
)
def get_pet_locations_by_id(
    pet_id: int, db: Session = Depends(get_db), u=Depends(get_user)
):
    pet = (
        db.query(Pet).filter((Pet.id == pet_id) & (Pet.owners.any(id=u["id"]))).first()
    )

    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    return pet.locations
