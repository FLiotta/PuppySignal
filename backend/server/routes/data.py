from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server.schemas import DataSpeciesResponse
from server.models import Specie
from server.utils import get_db

router = APIRouter()

@router.get('/species', response_model=DataSpeciesResponse)
def get_species(db: Session = Depends(get_db)):
  species = db.query(Specie).all()

  return {
    "data": species
  }