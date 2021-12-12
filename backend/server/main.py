from starlette.routing import request_response
import uvicorn
from typing import List


from server.database import SessionLocal
from sqlalchemy.orm import Session
from server.models import Pet, Specie, Code, UserPet, Notification
from server.schemas import SpecieSchema, PetSchema, CodeSchema, UserPetSchema, NotificationSchema
from fastapi import FastAPI, Depends

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/", response_model=List[NotificationSchema])
async def root(db: Session = Depends(get_db)):
    query = db.query(Notification).all()

    print(query)
    return query

if __name__ == "__main__":
    uvicorn.run(app, log_level="debug", reload=True)