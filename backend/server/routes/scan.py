import logging
from firebase_admin import messaging
from firebase_admin.exceptions import FirebaseError
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
from server.schemas import ScannedQRCodeResponse, ScanningPetCreateLocationBody
from sqlalchemy.orm import joinedload

router = APIRouter()


@router.get(
    "/{qr_code}",
    response_model=ScannedQRCodeResponse,
    dependencies=[Depends(Limiter("10/hour"))],
)
def scan_qr_code(qr_code: str, db: Session = Depends(get_db)):
    code = (
        db.query(Code)
        .filter(Code.code == qr_code)
        .options(joinedload(Code.pet).joinedload(Pet.owners))
        .options(joinedload(Code.pet).joinedload(Pet.specie))
        .first()
    )

    if not code:
        raise HTTPException(status_code=404, detail="Code not found.")

    db.close()

    with db.begin():
        try:
            new_notification = Notification(type="SCANNED", scanned_pet_id=code.pet.id)

            db.add(new_notification)
            db.flush()
            owners_list = []

            for owner in code.pet.owners:
                owners_list.append(
                    {
                        "first_name": owner.first_name,
                        "last_name": owner.last_name,
                        "phone_number": owner.phone_number,
                        "email": owner.email,
                    }
                )

                new_user_notification = UserNotification(
                    user_id=owner.id, notification_id=new_notification.id
                )

                db.add(new_user_notification)

                try:
                    message = messaging.Message(
                        notification=messaging.Notification(
                            title=f"{code.pet.name} was scanned!",
                            body="Your contact information was shared!",
                            image=code.pet.profile_picture,
                        ),
                        topic=owner.uuid,
                    )

                    messaging.send(message)
                except FirebaseError as e:
                    logging.error(
                        f"Error on firebase when sending notifications for Notification#{new_notification.id}: {e}"
                    )

            db.commit()

            del code.pet.owners

            return {"code": code.code, "pet": code.pet, "owners": owners_list}
        except Exception as e:
            db.rollback()
            logging.error(f"Error scanning code: {e}")
            raise HTTPException(status_code=500, detail="QR Code can't be scanned.")


@router.post(
    "/location",
    dependencies=[Depends(Limiter("10/hour"))],
)
def create_qr_code_location(
    body: ScanningPetCreateLocationBody, db: Session = Depends(get_db)
):
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
            new_notification = Notification(
                type="NEW_LOCATION", scanned_pet_id=code.pet.id
            )

            db.add(new_notification)
            db.add(new_location)

            db.flush()

            new_pet_location = PetLocation(
                pet_id=code.pet.id, location_id=new_location.id, method="NEW_LOCATION"
            )

            db.add(new_pet_location)

            for owner in code.pet.owners:
                new_user_notification = UserNotification(
                    user_id=owner.id, notification_id=new_notification.id
                )

                db.add(new_user_notification)

                try:
                    message = messaging.Message(
                        notification=messaging.Notification(
                            title=f"{code.pet.name} has a new location!",
                            body="Check your pet profile to see more!",
                            image=code.pet.profile_picture,
                        ),
                        topic=owner.uuid,
                    )

                    messaging.send(message)
                except FirebaseError as e:
                    logging.error(
                        f"Error on firebase when sending notifications for Notification#{new_notification.id}: {e}"
                    )

            db.commit()
        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="New location can't be created."
            )
