from firebase_admin import messaging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from simplelimiter import Limiter
from server.utils import get_db
from server.models import Pet, Code, UserNotification, Notification
from server.schemas import ScannedQRCodeResponse
from sqlalchemy.orm import joinedload

router = APIRouter()


@router.get(
    "/{qr_code}",
    response_model=ScannedQRCodeResponse,
    dependencies=[Depends(Limiter("5/hour"))],
)
def scan_qr_code(qr_code: str, db: Session = Depends(get_db)):
    code = (
        db.query(Code)
        .filter(Code.code == qr_code)
        .options(joinedload(Code.pet).joinedload(Pet.owners))
        .first()
    )

    db.close()

    print(code, flush=True)
    with db.begin():
        try:
            new_notification = Notification(type="SCANNED", scanned_pet_id=code.pet.id)
            db.add(new_notification)
            db.flush()

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
