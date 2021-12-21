from fastapi import APIRouter

router = APIRouter()

# TODO: rate limiter

@router.get("/", status_code=200)
def health():
  return