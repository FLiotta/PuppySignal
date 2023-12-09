from firebase_admin import messaging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from simplelimiter import Limiter
from server.utils import get_db
from server.models import (
    Pet,
    Code,
    UserNotification,
    Notification,
    Location,
    PetLocation,
)
from server.schemas import ScannedQRCodeResponse, ScanningPetQRCodeBody
from sqlalchemy.orm import joinedload

router = APIRouter()


@router.post(
    "/",
    response_model=ScannedQRCodeResponse,
    dependencies=[Depends(Limiter("5/hour"))],
)
def scan_qr_code(body: ScanningPetQRCodeBody, db: Session = Depends(get_db)):
    code = (
        db.query(Code)
        .filter(Code.code == body.qr_code)
        .options(joinedload(Code.pet).joinedload(Pet.owners))
        .first()
    )

    if not code:
        raise HTTPException(status_code=404, detail="Code not found.")
    db.close()

    with db.begin():
        try:
            new_location = Location(latitude=body.lat, longitude=body.lng)
            new_notification = Notification(type="SCANNED", scanned_pet_id=code.pet.id)

            db.add(new_location)
            db.add(new_notification)
            db.flush()

            new_pet_location = PetLocation(
                pet_id=code.pet.id, location_id=new_location.id, method="SCANNED"
            )

            db.add(new_pet_location)

            owners_uuids = []

            for owner in code.pet.owners:
                owners_uuids.append(owner.uuid)

                new_user_notification = UserNotification(
                    user_id=owner.id, notification_id=new_notification.id
                )

                db.add(new_user_notification)

            db.commit()

            for uuid in owners_uuids:
                message = messaging.Message(
                    notification=messaging.Notification(
                        title=f"{code.pet.name} was scanned!",
                        body="Check your pet profile to see more!",
                        image=code.pet.profile_picture,
                    ),
                    topic=uuid,
                )
                messaging.send(message)
            return {"data": code.pet}
        except Exception as e:
            db.rollback()
            print(e)
            raise HTTPException(status_code=500, detail="QR Code can't be scanned.")
