import jwt
import requests

from datetime import datetime, timedelta

from unittest.mock import patch

from starlette.testclient import TestClient
from server.models.user import User
from server.tests.base import BaseTestCase, FakeResponse
from server.models import RefreshToken

def fake_request_google_token(*args, **kwargs):
  return FakeResponse({
    "id": "123",
    "given_name": "Lorem",
    "family_name": "Ipsum",
    "email": "test@email.com",
    "picture": "http://localhost:1313"
  })

@patch.object(requests, "get", fake_request_google_token)
class TestAuthAPI(BaseTestCase):
  def test_register_new_user(self):
    token = "hola_mundo_soy_un_token_de_google"

    with TestClient(self.app) as client:
      body = {"token": token}
      resp = client.post('/api/v2/oauth/google', json=body)
      resp_data = resp.json()

      self.assertEqual(resp.status_code, 200)
      self.assertIsNotNone(resp_data["data"])

  def test_already_register_user(self):
    token = "hola_mundo_soy_un_token_de_google"

    with TestClient(self.app) as client:
      body = {"token": token}
      resp = client.post('/api/v2/oauth/google', json=body)
      resp_data = resp.json()

      self.assertEqual(resp.status_code, 200)
      self.assertIsNotNone(resp_data["data"])
      new_user_token = resp_data["data"]["access_token"]

      resp = client.post('/api/v2/oauth/google', json=body)
      resp_data = resp.json()

      self.assertEqual(resp.status_code, 200)
      self.assertIsNotNone(resp_data["data"])
      retrieve_user_token = resp_data["data"]["access_token"]

      new_user_data = jwt.decode(new_user_token, algorithms=["HS256"], options={ "verify_signature": False })
      retrieve_user_data = jwt.decode(retrieve_user_token, algorithms=["HS256"], options={ "verify_signature": False })

      self.assertEqual(new_user_data["id"], retrieve_user_data["id"])
  
  def test_refresh_token(self):
    user = User(
      first_name="user",
      last_name="lastuser",
      profile_picture="nose.com",
      email="lol@com"
    )
      
    self.db.add(user)
    self.db.commit()

    token = RefreshToken(
      token="loremip.fdsamq.qwemr",
      user_id=user.id,
      valid_until=datetime.utcnow() + timedelta(minutes=10)
    )
      
    self.db.add(token)
    self.db.commit()

    headers = {
      "refresh-token": token.token
    }

    with TestClient(self.app) as client:
      resp = client.post("/api/v2/oauth/jwt/refresh", headers=headers)
      resp_data = resp.json()

      self.assertEqual(resp.status_code, 200)
      self.assertIsNotNone(resp_data["data"])
      self.assertIn("access_token", resp_data["data"])
      self.assertIn("refresh_token", resp_data["data"])

      