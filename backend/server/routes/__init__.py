from fastapi import APIRouter

from server.routes import auth

api_router = APIRouter()

api_router.include_router(auth.router, tags=["oauth"], prefix="/oauth")