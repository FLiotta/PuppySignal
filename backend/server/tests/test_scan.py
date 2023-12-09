from unittest.mock import patch

from server.tests.base import BaseTestCase


class TestScanAPI(BaseTestCase):
    @patch("firebase_admin.messaging.send", return_value=None)
    def test_scan_pet(self, _send):
        resp = self.client.get(f"/api/v2/scan/{self.code.code}")

        self.assertEqual(resp.status_code, 200)

    def test_scan_pet_invalid_code(self):
        resp = self.client.get("/api/v2/scan/fake_code")

        self.assertEqual(resp.status_code, 500)
