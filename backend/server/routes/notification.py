from fastapi import APIRouter

router = APIRouter()

@router.post("/suscribe")
def subscribe_notification():
  return None

@router.post("/unsuscribe")
def unsubscribe_notification():
  return None

# TODO Everything.
