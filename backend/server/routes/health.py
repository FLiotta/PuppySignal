from fastapi import APIRouter, Depends
from simplelimiter import Limiter

router = APIRouter()


@router.get("/", status_code=200, dependencies=[Depends(Limiter("5/minute"))])
def health():
    return {"status": "ok"}
