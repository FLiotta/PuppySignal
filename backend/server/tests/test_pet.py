import boto3
import os

from unittest.mock import patch

from server.tests.base import BaseTestCase, FakeB3Client
from server.models import Pet


class TestPetAPI(BaseTestCase):
    @patch.object(boto3, "client", lambda *_, **__: FakeB3Client())
    def test_create_pet(self):
        pet_payload = {
            "name": "Daisy",
            "description": "Small size dog with beautiful eyes and white chest",
            "specie_id": 1,
        }
        headers = {"token": self.token}

        resp = self.client.post(
            "/api/v2/pet/",
            data=pet_payload,
            headers=headers,
            files={
                "file": (
                    "filename.png",
                    open(
                        os.path.join(os.path.dirname(__file__), "test_photo.png"), "rb"
                    ),
                    "image/png",
                )
            },
        )
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 200)
        self.assertIsNotNone(resp_data)
        self.assertIn("name", resp_data)
        self.assertIn("specie", resp_data)
        self.assertIn("description", resp_data)
        self.assertIn("profile_picture", resp_data)

    @patch.object(boto3, "client", lambda *_, **__: FakeB3Client(fail=True))
    def test_create_pet_fail_photo_upload(self):
        pet_payload = {
            "name": "Fail_Test_Daisy",
            "description": "Small size dog with beautiful eyes and white chest",
            "specie_id": 1,
        }
        headers = {"token": self.token}

        resp = self.client.post(
            "/api/v2/pet/",
            data=pet_payload,
            headers=headers,
            files={
                "file": (
                    "filename.png",
                    open(
                        os.path.join(os.path.dirname(__file__), "test_photo.png"), "rb"
                    ),
                    "image/png",
                )
            },
        )
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 500)
        self.assertIsNotNone(resp_data["detail"])
        self.assertEqual(resp_data["detail"], "Pet can't be created.")

        pets_created = (
            self.db.query(Pet).filter(Pet.name == pet_payload["name"]).count()
        )

        self.assertEqual(pets_created, 0)

    def test_create_pet_fail_photo_size_bigger(self):
        pet_payload = {
            "name": "Fail_Test_Daisy",
            "description": "Small size dog with beautiful eyes and white chest",
            "specie_id": 1,
        }
        headers = {"token": self.token}

        resp = self.client.post(
            "/api/v2/pet/",
            data=pet_payload,
            headers=headers,
            files={
                "file": (
                    "filename.png",
                    open(
                        os.path.join(
                            os.path.dirname(__file__), "test_photo_bigger.png"
                        ),
                        "rb",
                    ),
                    "image/png",
                )
            },
        )
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 400)

        self.assertEqual(resp_data["detail"], "Image can't be larger than 640x640")

        pets_created = (
            self.db.query(Pet).filter(Pet.name == pet_payload["name"]).count()
        )

        self.assertEqual(pets_created, 0)

    def test_create_pet_fail_photo_aspect_ratio_not_1_at_1(self):
        pet_payload = {
            "name": "Fail_Test_Daisy",
            "description": "Small size dog with beautiful eyes and white chest",
            "specie_id": 1,
        }
        headers = {"token": self.token}

        resp = self.client.post(
            "/api/v2/pet/",
            data=pet_payload,
            headers=headers,
            files={
                "file": (
                    "filename.png",
                    open(
                        os.path.join(
                            os.path.dirname(__file__), "test_photo_aspect_ratio.png"
                        ),
                        "rb",
                    ),
                    "image/png",
                )
            },
        )
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 400)

        self.assertEqual(resp_data["detail"], "Pet avatar must be 1:1 aspect ratio.")

        pets_created = (
            self.db.query(Pet).filter(Pet.name == pet_payload["name"]).count()
        )

        self.assertEqual(pets_created, 0)

    @patch.object(boto3, "client", lambda *_, **__: FakeB3Client())
    def test_get_pet_by_id(self):
        headers = {"token": self.token}

        resp = self.client.get(f"/api/v2/pet/{self.pet_1.id}", headers=headers)
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 200)

        self.assertEqual(self.pet_1.name, resp_data["name"])
        self.assertEqual(self.pet_1.id, resp_data["id"])
        self.assertEqual(self.pet_1.description, resp_data["description"])

    def test_get_pet_by_id_not_owner(self):
        headers = {"token": f"{self.token_2}"}

        resp = self.client.get(f"/api/v2/pet/{self.pet_1.id}", headers=headers)
        self.assertEqual(resp.status_code, 404)

    def test_get_pet_by_id_not_found(self):
        headers = {"token": self.token}

        resp = self.client.get("/api/v2/pet/420", headers=headers)
        self.assertEqual(resp.status_code, 404)

    def test_delete_pet_by_id(self):
        headers = {"token": self.token}

        resp = self.client.delete(f"/api/v2/pet/{self.pet_1.id}", headers=headers)

        self.assertEqual(resp.status_code, 200)

    def test_delete_pet_by_id_not_owner(self):
        headers = {"token": f"{self.token_2}"}

        resp = self.client.delete(f"/api/v2/pet/{self.pet_1.id}", headers=headers)
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp_data["detail"], "Request cannot be fullfiled.")

    def test_update_pet(self):
        headers = {"token": self.token}
        payload = {"name": "perrito"}

        resp = self.client.patch(
            f"/api/v2/pet/{self.pet_1.id}", json=payload, headers=headers
        )

        self.assertEqual(resp.status_code, 200)

    def test_update_pet_no_payload(self):
        headers = {"token": self.token}
        payload = {}

        resp = self.client.patch(
            f"/api/v2/pet/{self.pet_1.id}", json=payload, headers=headers
        )

        self.assertEqual(resp.status_code, 400)

    def test_update_pet_no_owner(self):
        headers = {"token": f"{self.token_2}"}
        payload = {"name": "perrito"}

        resp = self.client.patch(
            f"/api/v2/pet/{self.pet_1.id}", json=payload, headers=headers
        )

        self.assertEqual(resp.status_code, 404)

    def test_get_pet_codes(self):
        headers = {"token": self.token}

        resp = self.client.get(f"/api/v2/pet/{self.pet_1.id}/codes", headers=headers)
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 200)
        self.assertGreater(len(resp_data), 0)

    def test_get_pet_codes_no_owner(self):
        headers = {"token": f"{self.token_2}"}

        resp = self.client.get(f"/api/v2/pet/{self.pet_1.id}/codes", headers=headers)

        self.assertEqual(resp.status_code, 404)

    def test_get_pet_locations(self):
        headers = {"token": self.token}

        resp = self.client.get(
            f"/api/v2/pet/{self.pet_1.id}/locations", headers=headers
        )
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 200)
        self.assertGreater(len(resp_data), 0)

    def test_get_pet_locations_no_owner(self):
        headers = {"token": f"{self.token_2}"}

        resp = self.client.get(
            f"/api/v2/pet/{self.pet_1.id}/locations", headers=headers
        )

        self.assertEqual(resp.status_code, 404)
