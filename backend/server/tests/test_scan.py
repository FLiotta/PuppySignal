import boto3

from unittest.mock import patch

from server.tests.base import BaseTestCase, FakeB3Client
from server.models import PetLocation, Notification


class TestScanAPI(BaseTestCase):
    @patch("firebase_admin.messaging.send", return_value=None)
    @patch.object(boto3, "client", lambda *_, **__: FakeB3Client())
    def test_scan_pet(self, _):
        resp = self.client.get(f"/api/v2/scan/{self.code.code}")
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 200)

        self.assertIn("pet", resp_data)
        self.assertIn("owners", resp_data)
        self.assertIn("code", resp_data)

        last_notification = (
            self.db.query(Notification).order_by(Notification.id.desc()).first()
        )

        self.assertEqual(last_notification.type, "SCANNED")
        self.assertEqual(len(last_notification.owners), len(self.code.pet.owners))

    def test_scan_pet_invalid_code(self):
        resp = self.client.get("/api/v2/scan/invalid_code")
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 404)
        self.assertEqual(resp_data["detail"], "Code not found.")

    @patch("firebase_admin.messaging.send", return_value=None)
    def test_scan_create_location(self, _):
        resp = self.client.post(
            url="/api/v2/scan/location",
            json={"qr_code": self.code.code, "lat": 1.20, "lng": 1.50},
        )
        self.assertEqual(resp.status_code, 200)

        # We check the post-scan information was created.
        last_location = self.code.pet.locations.pop()

        self.assertEqual(last_location.latitude, 1.20)
        self.assertEqual(last_location.longitude, 1.50)

        pet_location = (
            self.db.query(PetLocation)
            .filter(
                (PetLocation.location_id == last_location.id)
                & (PetLocation.pet_id == self.code.pet.id)
            )
            .first()
        )

        self.assertIsNotNone(pet_location)

        last_notification = (
            self.db.query(Notification).order_by(Notification.id.desc()).first()
        )

        self.assertEqual(last_notification.type, "NEW_LOCATION")
        self.assertEqual(len(last_notification.owners), len(self.code.pet.owners))
