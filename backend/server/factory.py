import redis as redis_pkg
import logging

from os.path import join, dirname, pardir
from os import environ

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.routes import api_router

load_dotenv(join(dirname(__file__), pardir, '.env'))

def create_app():
  description = "PuppySignal API"
  app = FastAPI(
    title="PuppySignal API",
    openapi_url="/api/openapi.json",
    docs_url="/docs/",
    description=description,
    redoc_url=None
  )
  
  app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )

  init_db_hooks(app)
  app.include_router(api_router, prefix="/api/v2")

  return app

def init_db_hooks(app: FastAPI) -> None:
  from server.database import database

  @app.on_event("startup")
  async def startup():
    await database.connect()
  
  @app.on_event("shutdown")
  async def shutdown():
    await database.disconnect()