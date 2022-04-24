from unittest.mock import patch

from starlette.testclient import TestClient
from server.tests.base import BaseTestCase
from server.models import Pet, UserPet, Notification, UserNotification

from twilio.rest.verify import Verify

class FakeTwilioService:
  def __init__(self, *_):
    pass

  def create(self, *args, **kwargs):
    pass

class FakeTwilioServices:
  def __init__(self, *_):
    self.verifications = FakeTwilioService()
    self.verification_checks = FakeTwilioService()

class TestProfileAPI(BaseTestCase):
  def setUp(self) -> None:
      super().setUp()

  def test_get_profile(self):
    with TestClient(self.app) as client:
      headers = {
        "token": f"{self.token}"
      }
      resp = client.get('/api/v2/profile', headers=headers)
      resp_data = resp.json()

      self.assertEqual(resp.status_code, 200)
      self.assertIsNotNone(resp_data["data"])

      self.assertEqual(self.user.id, resp_data["data"]["id"])
      self.assertEqual(self.user.first_name, resp_data["data"]["first_name"])
      self.assertEqual(self.user.last_name, resp_data["data"]["last_name"])
      self.assertEqual(self.user.email, resp_data["data"]["email"])
      self.assertEqual(self.user.profile_picture, resp_data["data"]["profile_picture"])

  def test_patch_profile(self):
    with TestClient(self.app) as client:
      headers = {
        "token": f"{self.token}"
      }

      # Update first_name and last_name
      payload = { 
        "first_name": "new_name",
        "last_name": "new_lastname" 
      }
      resp = client.patch('/api/v2/profile/', json=payload, headers=headers)
      self.assertEqual(resp.status_code, 200)

      resp = client.get('/api/v2/profile', headers=headers)
      user = resp.json()["data"]
      
      self.assertIsNotNone(user)

      self.assertEqual(user["first_name"], payload["first_name"])
      self.assertEqual(user["last_name"], payload["last_name"])

      headers = {
        "token": f"{self.token}"
      }

      # Update empty body
      payload = {}
      resp = client.patch('/api/v2/profile/', json=payload, headers=headers)
      self.assertEqual(resp.status_code, 400)
  
  def test_profile_pets(self):
    pet_1 = Pet(
      name="woof",
      profile_picture="http://localhost",
      extra="nomthing",
      specie_id=1,
      color="black"
    )

    self.db.add(pet_1)
    self.db.commit()
    
    self.db.add(
      UserPet(
        user_id=self.user.id,
        pet_id=pet_1.id
      )
    )
    self.db.commit()

    with TestClient(self.app) as client:
      headers = {
        "token": f"{self.token}"
      }
      resp = client.get('/api/v2/profile/pets', headers=headers)
      resp_data = resp.json()

      self.assertEqual(resp.status_code, 200)
      self.assertIsNotNone(resp_data["data"])
      self.assertGreater(len(resp_data["data"]), 0)
  
  def test_profile_notifications(self):
    notification = Notification(
      type="SCANNED",
      scanned_pet_id=self.pet_1.id
    )
    self.db.add(notification)
    self.db.commit()
    self.db.add(
      UserNotification(
        user_id=self.user.id,
        notification_id=notification.id
      )
    )
    self.db.commit()

    with TestClient(self.app) as client:
      headers = {
        "token": f"{self.token}"
      }
      resp = client.get('/api/v2/profile/notifications', headers=headers)
      resp_data = resp.json()

      self.assertEqual(resp.status_code, 200)
      self.assertIsNotNone(resp_data["data"])
      self.assertGreater(len(resp_data["data"]), 0)
  
  @patch.object(Verify, "services", lambda *_: FakeTwilioServices())
  def test_profile_phone_number(self):
    with TestClient(self.app) as client:
      headers = {
        "token": f"{self.token}"
      }

      # No phone number param
      body = {}
      resp = client.post('/api/v2/profile/phone_number', json=body, headers=headers)
      resp_data = resp.json()

      self.assertEqual(resp.status_code, 422)

      # Correct flow
      body = {
        "phone_number": "+5493413200000"
      }
      resp = client.post('/api/v2/profile/phone_number', json=body, headers=headers)
      resp_data = resp.json()

      self.assertIsNone(resp_data)
      self.assertEqual(resp.status_code, 200)
  
  @patch.object(Verify, "services", lambda *_: FakeTwilioServices())
  def test_profile_phone_number(self):
    with TestClient(self.app) as client:
      headers = {
        "token": f"{self.token}"
      }

      # No param
      body = {}
      resp = client.post('/api/v2/profile/phone_number/verify', json=body, headers=headers)

      self.assertEqual(resp.status_code, 422)

      body = {"phone_number": "+5493413200000"}
      resp = client.post('/api/v2/profile/phone_number/verify', json=body, headers=headers)

      self.assertEqual(resp.status_code, 422)

      body = {"code": "123456"}
      resp = client.post('/api/v2/profile/phone_number/verify', json=body, headers=headers)

      self.assertEqual(resp.status_code, 422)

      # Correct flow
      body = {
        "phone_number": "+5493413200000",
        "code": "123456"
      }

      resp = client.post('/api/v2/profile/phone_number/verify', json=body, headers=headers)
      resp_data = resp.json()

      self.assertIsNone(resp_data)
      self.assertEqual(resp.status_code, 200)