from unittest.mock import patch

from server.tests.base import BaseTestCase
from server.models import PetLocation


class TestScanAPI(BaseTestCase):
    @patch("firebase_admin.messaging.send", return_value=None)
    def test_scan_pet(self, _send):
        resp = self.client.post(
            url="/api/v2/scan",
            json={"qr_code": self.code.code, "lat": 1.20, "lng": 1.50},
        )
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 200)

        self.assertIn("pet", resp_data)
        self.assertIn("owners", resp_data)
        self.assertIn("code", resp_data)

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

    def test_scan_pet_invalid_code(self):
        resp = self.client.post(
            url="/api/v2/scan",
            json={"qr_code": "unknown_code", "lat": 1.20, "lng": 1.50},
        )
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 404)
        self.assertEqual(resp_data["detail"], "Code not found.")
