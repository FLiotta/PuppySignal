import boto3
import os
from pathlib import Path
from unittest.mock import patch

from starlette.testclient import TestClient
from server.tests.base import BaseTestCase
from server.models import Pet, UserPet, Notification, UserNotification


class FakeB3Client:
  def __init__(self, fail: bool = False):
    self.fail = fail

  def put_object(self, *args, **kwargs):
    if self.fail:
      raise RuntimeError("Cannot upload photo")

    return 1

class TestPetAPI(BaseTestCase):

  @patch.object(boto3, "client", lambda *_, **__: FakeB3Client())
  def test_create_pet(self):
    pet_payload = {
      "name": "Daisy",
      "description": "Small size dog with beautiful eyes and white chest",
      "specie_id": 1
    }
    headers = {
      "token": f"{self.token}"
    }

    with TestClient(self.app) as client:
      resp = client.post(
        "/api/v2/pet/", 
        data=pet_payload,
        headers=headers,
        files = {
          "file": (
            "filename.png",
            open(os.path.join(os.path.dirname( __file__ ), '..', 'test_photo.png'), "rb"),
            "image/png"
          )
        }, 
      )
      resp_data = resp.json()
      
      self.assertEqual(resp.status_code, 200)
      self.assertIsNotNone(resp_data["data"])
      self.assertIn("name", resp_data["data"])
      self.assertIn("specie", resp_data["data"])
      self.assertIn("extra", resp_data["data"])
      self.assertIn("profile_picture", resp_data["data"])

  @patch.object(boto3, "client", lambda *_, **__: FakeB3Client(fail=True))
  def test_create_pet_fail_photo_upload(self):
    pet_payload = {
      "name": "Fail_Test_Daisy",
      "description": "Small size dog with beautiful eyes and white chest",
      "specie_id": 1
    }
    headers = {
      "token": f"{self.token}"
    }

    with TestClient(self.app) as client:
      resp = client.post(
        "/api/v2/pet/", 
        data=pet_payload,
        headers=headers,
        files = {
          "file": (
            "filename.png",
            open(os.path.join(os.path.dirname(__file__), '..', 'test_photo.png'), "rb"),
            "image/png"
          )
        },
      )
      resp_data = resp.json()
      
      self.assertEqual(resp.status_code, 500)
      self.assertIsNotNone(resp_data["detail"])
      self.assertEqual(resp_data["detail"], "Pet can't be created.")

      pets_created = self.db.query(Pet).filter(Pet.name==pet_payload["name"]).count()

      self.assertEqual(pets_created, 0)
  
  def test_create_pet_fail_photo_size_bigger(self):
    pet_payload = {
      "name": "Fail_Test_Daisy",
      "description": "Small size dog with beautiful eyes and white chest",
      "specie_id": 1
    }
    headers = {
      "token": f"{self.token}"
    }

    with TestClient(self.app) as client:
      resp = client.post(
        "/api/v2/pet/", 
        data=pet_payload,
        headers=headers,
        files = {
          "file": (
            "filename.png",
            open(os.path.join(os.path.dirname(__file__), '..', 'test_photo_bigger.png'), "rb"),
            "image/png"
          )
        }, 
      )
      resp_data = resp.json()
      
      self.assertEqual(resp.status_code, 400)
    
      self.assertEqual(resp_data["detail"], "Image can't be larger than 640x640")

      pets_created = self.db.query(Pet).filter(Pet.name==pet_payload["name"]).count()

      self.assertEqual(pets_created, 0)
  
  def test_create_pet_fail_photo_aspect_ratio_not_1_at_1(self):
    pet_payload = {
      "name": "Fail_Test_Daisy",
      "description": "Small size dog with beautiful eyes and white chest",
      "specie_id": 1
    }
    headers = {
      "token": f"{self.token}"
    }

    with TestClient(self.app) as client:
      resp = client.post(
        "/api/v2/pet/", 
        data=pet_payload,
        headers=headers,
        files = {
          "file": (
            "filename.png",
            open(os.path.join(os.path.dirname(__file__), '..', 'test_photo_aspect_ratio.png'), "rb"),
            "image/png"
          )
        }
      )
      resp_data = resp.json()
      
      self.assertEqual(resp.status_code, 400)
    
      self.assertEqual(resp_data["detail"], "Pet avatar must be 1:1 aspect ratio.")

      pets_created = self.db.query(Pet).filter(Pet.name==pet_payload["name"]).count()

      self.assertEqual(pets_created, 0)
  
  def test_get_pet_by_id(self):
    headers = {
      "token": f"{self.token}"
    }

    with TestClient(self.app) as client:
      resp = client.get(f"/api/v2/pet/{self.pet_1.id}", headers=headers)
      resp_data = resp.json()

      self.assertEqual(resp.status_code, 200)
      
      self.assertEqual(self.pet_1.name, resp_data["data"]["name"])
      self.assertEqual(self.pet_1.id, resp_data["data"]["id"])
      self.assertEqual(self.pet_1.extra, resp_data["data"]["extra"])
  
  def test_get_pet_by_id_not_owner(self):
    headers = {
      "token": f"{self.token_2}"
    }

    with TestClient(self.app) as client:
      resp = client.get(f"/api/v2/pet/{self.pet_1.id}", headers=headers)
      self.assertEqual(resp.status_code, 404)

  def test_get_pet_by_id_not_found(self):
    headers = {
      "token": f"{self.token}"
    }

    with TestClient(self.app) as client:
      resp = client.get("/api/v2/pet/420", headers=headers)
      self.assertEqual(resp.status_code, 404)
    
  def test_delete_pet_by_id(self):
    headers = {
      "token": f"{self.token}"
    }

    with TestClient(self.app) as client:
      resp = client.delete(f"/api/v2/pet/{self.pet_1.id}", headers=headers)

      self.assertEqual(resp.status_code, 200)

  def test_delete_pet_by_id_not_owner(self):
    headers = {
      "token": f"{self.token_2}"
    }

    with TestClient(self.app) as client:
      resp = client.delete(f"/api/v2/pet/{self.pet_1.id}", headers=headers)
      resp_data = resp.json()

      self.assertEqual(resp.status_code, 400)
      self.assertEqual(resp_data["detail"], "Request cannot be fullfiled.")
  
  def test_update_pet(self):
    headers = {
      "token": f"{self.token}"
    }
    payload = {
      "name": "perrito"
    }

    with TestClient(self.app) as client:
      resp = client.patch(f"/api/v2/pet/{self.pet_1.id}", json=payload, headers=headers)

      self.assertEqual(resp.status_code, 200)
  
  def test_update_pet_no_payload(self):
    headers = {
      "token": f"{self.token}"
    }
    payload = {}

    with TestClient(self.app) as client:
      resp = client.patch(f"/api/v2/pet/{self.pet_1.id}", json=payload, headers=headers)

      self.assertEqual(resp.status_code, 400)
  
  def test_update_pet_no_owner(self):
    headers = {
      "token": f"{self.token_2}"
    }
    payload = {
      "name": "perrito"
    }

    with TestClient(self.app) as client:
      resp = client.patch(f"/api/v2/pet/{self.pet_1.id}", json=payload, headers=headers)

      self.assertEqual(resp.status_code, 404)

  def test_get_pet_codes(self):
    headers = {
      "token": f"{self.token}"
    }

    with TestClient(self.app) as client:
      resp = client.get(f"/api/v2/pet/{self.pet_1.id}/codes", headers=headers)
      resp_data = resp.json()

      self.assertEqual(resp.status_code, 200)
      self.assertGreater(len(resp_data["data"]), 0)
      
  def test_get_pet_codes_no_owner(self):
    headers = {
      "token": f"{self.token_2}"
    }

    with TestClient(self.app) as client:
      resp = client.get(f"/api/v2/pet/{self.pet_1.id}/codes", headers=headers)

      self.assertEqual(resp.status_code, 404)
  
  def test_get_pet_locations(self):
    headers = {
      "token": f"{self.token}"
    }

    with TestClient(self.app) as client:
      resp = client.get(f"/api/v2/pet/{self.pet_1.id}/locations", headers=headers)
      resp_data = resp.json()

      self.assertEqual(resp.status_code, 200)
      self.assertGreater(len(resp_data["data"]), 0)
      
  def test_get_pet_locations_no_owner(self):
    headers = {
      "token": f"{self.token_2}"
    }

    with TestClient(self.app) as client:
      resp = client.get(f"/api/v2/pet/{self.pet_1.id}/locations", headers=headers)

      self.assertEqual(resp.status_code, 404)
  
  def test_create_pet_location(self):
    headers = {
      "token": f"{self.token}"
    }
    payload = {
      "qr_code": self.code.code,
      "lng": "12.3042",
      "lat": "11.1234"
    }

    with TestClient(self.app) as client:
      resp = client.post(f"/api/v2/pet/{self.pet_1.id}/locations", json=payload, headers=headers)

      self.assertEqual(resp.status_code, 200)
  
  def test_create_pet_location_invalid_code(self):
    headers = {
      "token": f"{self.token}"
    }
    payload = {
      "qr_code": "hola mundo",
      "lng": "12.3042",
      "lat": "11.1234"
    }

    with TestClient(self.app) as client:
      resp = client.post(f"/api/v2/pet/{self.pet_1.id}/locations", json=payload, headers=headers)

      self.assertEqual(resp.status_code, 404)

  def test_scan_pet(self):
    with TestClient(self.app) as client:
      resp = client.get(f"/api/v2/pet/scanned/{self.code.code}")

      self.assertEqual(resp.status_code, 200)
  
  def test_scan_pet_invalid_code(self):
    with TestClient(self.app) as client:
      resp = client.get("/api/v2/pet/scanned/hola_mundo")

      self.assertEqual(resp.status_code, 500)