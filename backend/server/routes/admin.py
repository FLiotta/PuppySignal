from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from nanoid import generate

from server.models import Code
from server.utils import get_db

router = APIRouter()

# TODO: Only administrator should be able to generate codes.

@router.post('/generate_codes', status_code=201)
def generate_codes(db: Session = Depends(get_db)):
  codes = [Code()] * 50

  db.bulk_save_objects(codes)

  db.commit()