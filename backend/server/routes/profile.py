from typing import List

from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc
from simplelimiter import Limiter

from server.models import User, Notification, Pet
from server.schemas.user import UserSchema
from server.schemas.notification import NotificationWithPetSchema
from server.schemas.services import ProfilePatchBody, ProfilePetsResponse
from server.utils import get_db, protected_route, get_user, get_settings

settings = get_settings()
router = APIRouter()


@router.get(
    "/",
    response_model=UserSchema,
    dependencies=[Depends(protected_route), Depends(Limiter("5/hour"))],
)
def get_profile(db: Session = Depends(get_db), u: UserSchema = Depends(get_user)):
    user = db.query(User).filter(User.id == u["id"]).first()

    if not user:
        raise HTTPException(status_code=404, detail="Profile not found.")

    return user


@router.patch(
    "/",
    status_code=200,
    dependencies=[Depends(protected_route), Depends(Limiter("10/day"))],
)
def update_profile(
    body: ProfilePatchBody,
    db: Session = Depends(get_db),
    u: UserSchema = Depends(get_user),
):
    if not body.first_name and not body.last_name and not body.phone_number:
        raise HTTPException(
            status_code=400, detail="You must provide at least one parameter to update"
        )

    user = db.query(User).filter(User.id == u["id"]).first()

    if body.first_name:
        user.first_name = body.first_name

    if body.last_name:
        user.last_name = body.last_name

    if body.phone_number:
        user.phone_number = body.phone_number

    db.commit()


@router.get(
    "/pets",
    response_model=ProfilePetsResponse,
    dependencies=[Depends(protected_route), Depends(Limiter("5/minute"))],
)
def get_user_pets(
    limit: int = 5,
    offset: int = 0,
    db: Session = Depends(get_db),
    u: UserSchema = Depends(get_user),
):
    pets = (
        db.query(Pet)
        .filter(Pet.owners.any(id=u["id"]))
        .limit(limit)
        .offset(offset)
        .options(joinedload(Pet.specie))
        .all()
    )

    pets_count = (
        db.query(func.count(Pet.id)).filter(Pet.owners.any(id=u["id"])).scalar()
    )

    return {"data": pets, "total": pets_count}


@router.get(
    "/notifications",
    response_model=List[NotificationWithPetSchema],
    dependencies=[Depends(protected_route), Depends(Limiter("5/minute"))],
)
def get_user_notifications(
    limit: int = 5,
    offset: int = 0,
    db: Session = Depends(get_db),
    u: UserSchema = Depends(get_user),
):
    notifications = (
        db.query(Notification)
        .filter(Notification.owners.any(id=u["id"]))
        .order_by(desc(Notification.id))
        .limit(limit)
        .offset(offset)
        .options(joinedload(Notification.pet))
        .all()
    )

    return notifications
