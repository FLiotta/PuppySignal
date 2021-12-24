from fastapi import APIRouter

from server.routes import auth, data, admin, profile, pet, health, notification

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"], prefix="/health")
api_router.include_router(admin.router, tags=["admin"], prefix="/admin")
api_router.include_router(auth.router, tags=["oauth"], prefix="/oauth")
api_router.include_router(notification.router, tags=["notification"], prefix="/notification")
api_router.include_router(data.router, tags=["data"], prefix="/data")
api_router.include_router(profile.router, tags=["profile"], prefix="/profile")
api_router.include_router(pet.router, tags=["pet"], prefix="/pet")