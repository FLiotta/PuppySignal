import sys
import redis
import firebase_admin

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from simplelimiter import Limiter
from server.routes import api_router
from server.utils import settings


def create_app():
    app = FastAPI(
        title="PuppySignal API",
        openapi_url="/api/openapi.json",
        docs_url="/docs/",
        description="PuppySignal API",
        redoc_url=None,
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

        if not ("unittest" in sys.modules or "pytest" in sys.modules):
            # Do not initialize the rate-limiter neither firebase when app created from within tests
            firebase_admin.initialize_app(
                credential=firebase_admin.credentials.Certificate(
                    "./firebase_admin_key.json"
                )
            )

            redis_url = f"redis://{settings.redis_host}:{settings.redis_port}"
            redis_instance = redis.from_url(
                redis_url, encoding="utf-8", decode_responses=True
            )

            Limiter.init(redis_instance=redis_instance, debug=True)

    @app.on_event("shutdown")
    async def shutdown():
        await database.disconnect()
