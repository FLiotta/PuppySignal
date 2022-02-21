import uvicorn
import redis as redis_pkg

from os.path import join, dirname, pardir
from os import environ

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.routes import api_router

load_dotenv(join(dirname(__file__), pardir, '.env'))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v2")

if __name__ == "__main__":
    uvicorn.run(app, log_level="debug", reload=True)