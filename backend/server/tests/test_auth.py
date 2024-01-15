import time
import jwt
import requests

from datetime import datetime, timedelta

from unittest.mock import patch

from server.tests.base import BaseTestCase, FakeResponse
from server.models import RefreshToken


def fake_request_google_token(*_, **__):
    return FakeResponse(
        {
            "id": "123",
            "given_name": "Lorem",
            "family_name": "Ipsum",
            "email": "test@email.com",
            "picture": "http://localhost:1313",
        }
    )


@patch.object(requests, "get", fake_request_google_token)
class TestAuthAPI(BaseTestCase):
    def test_register_new_user(self):
        token = "hola_mundo_soy_un_token_de_google"

        body = {"token": token}
        resp = self.client.post("/api/v2/oauth/google", json=body)
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 200)
        self.assertIsNotNone(resp_data["data"])

    def test_already_register_user(self):
        token = "hola_mundo_soy_un_token_de_google"

        body = {"token": token}
        resp = self.client.post("/api/v2/oauth/google", json=body)
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 200)
        self.assertIsNotNone(resp_data["data"])
        new_user_token = resp_data["data"]["access_token"]

        resp = self.client.post("/api/v2/oauth/google", json=body)
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 200)
        self.assertIsNotNone(resp_data["data"])
        retrieve_user_token = resp_data["data"]["access_token"]

        new_user_data = jwt.decode(
            new_user_token, algorithms=["HS256"], options={"verify_signature": False}
        )
        retrieve_user_data = jwt.decode(
            retrieve_user_token,
            algorithms=["HS256"],
            options={"verify_signature": False},
        )

        self.assertEqual(new_user_data["id"], retrieve_user_data["id"])

    def test_refresh_token_success(self):
        token = RefreshToken(
            token="loremip.fdsamq.qwemr",
            user_id=self.user.id,
            valid_until=datetime.utcnow() + timedelta(minutes=10),
        )

        self.db.add(token)
        self.db.commit()

        headers = {"refresh-token": token.token}

        resp = self.client.post("/api/v2/oauth/jwt/refresh", headers=headers)
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 200)
        self.assertIsNotNone(resp_data["data"])
        self.assertIn("access_token", resp_data["data"])

    def test_expired_refresh_token_is_deleted(self):
        token = RefreshToken(
            token="loremip.fdsamq.qwemr",
            user_id=self.user.id,
            valid_until=datetime(2023, 2, 15),
        )

        self.db.add(token)
        self.db.commit()

        time.sleep(1)

        headers = {"refresh-token": token.token}

        resp = self.client.post("/api/v2/oauth/jwt/refresh", headers=headers)

        self.assertEqual(resp.status_code, 400)

        resp_data = resp.json()

        self.assertEqual(resp_data["detail"], "Expired refresh token.")

        expired_token = (
            self.db.query(RefreshToken)
            .filter(RefreshToken.token == token.token)
            .first()
        )

        self.assertIsNone(expired_token)

    def test_delete_refresh_token(self):
        token = RefreshToken(
            token="lorem.ipsum.token",
            user_id=self.user.id,
            valid_until=datetime(2023, 2, 15),
        )

        self.db.add(token)
        self.db.commit()

        headers = {"refresh-token": token.token}

        resp = self.client.delete("/api/v2/oauth/jwt/refresh", headers=headers)

        self.assertEqual(resp.status_code, 200)

        deleted_token = (
            self.db.query(RefreshToken)
            .filter(RefreshToken.token == token.token)
            .first()
        )

        self.assertIsNone(deleted_token)

    def test_delete_refresh_token_not_found(self):
        headers = {"refresh-token": "not.found.token"}

        resp = self.client.delete("/api/v2/oauth/jwt/refresh", headers=headers)

        self.assertEqual(resp.status_code, 404)
