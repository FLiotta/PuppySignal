from server import models
from server.database import engine, Base

if __name__ == "__main__":
    # https://fastapi.tiangolo.com/tutorial/sql-databases/#main-fastapi-app
    Base.metadata.create_all(bind=engine)