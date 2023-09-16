from fastapi import APIRouter, Depends, Request
from simplelimiter import Limiter
from sqlalchemy.orm import Session

from server.schemas import DataSpeciesResponse
from server.models import Specie
from server.utils import get_db, protected_route

router = APIRouter()

# Should we only let auth people to request data? I mean, this information is general and pretty vague
# But letting anyone request these endpoints could lead to an incident in the future?

@router.get(
    '/species', 
    response_model=DataSpeciesResponse,
    dependencies=[Depends(Limiter("5/minute"))]
)
def get_species(
  limit: int = 10,
  offset: int = 0,
  db: Session = Depends(get_db)
):
  species = (
    db.query(Specie)
      .limit(limit)
      .offset(offset)
      .all()
  )

  return {
    "data": species
  }
