from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session

from server.models import User
from server.schemas import UserSchema, ProfileResponse, ProfilePatchBody, ProfilePetsResponse
from server.utils import get_db, protected_route, get_user

router = APIRouter()


@router.get("/", response_model=ProfileResponse, dependencies=[Depends(protected_route)])
def get_profile(db: Session = Depends(get_db), u: UserSchema = Depends(get_user)):
  user = db.query(User).filter(User.id == u["id"]).first()

  if not user:
    raise HTTPException(status_code=404, detail="Profile not found (wtf???).")

  return {
    "data": user
  }

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

@router.get("/pets", response_model=ProfilePetsResponse, dependencies=[Depends(protected_route)])
def get_user_pets(db: Session = Depends(get_db), u: UserSchema = Depends(get_user)):
  user = db.query(User).filter(User.id == u["id"]).first()

  return {
    "data": user.pets
  }