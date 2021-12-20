from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from server.schemas import PetSchema, CodeSchema
from server.utils import get_db, get_user, protected_route
from server.models import Pet, Code

router = APIRouter()

# TODO: rate limiter

@router.get("/{pet_id}", response_model=PetSchema, dependencies=[Depends(protected_route)])
def get_pet_by_id(pet_id: int, db: Session = Depends(get_db),  u = Depends(get_user)):
  pet = db.query(Pet).filter(
    (Pet.id == pet_id) & (Pet.owners.any(id=u['id']))
  ).first()

  if not pet:
    raise HTTPException(status_code=404, detail="Pet not found")

  return pet

# TODO: rate limiter

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

  return parsed_codes