from server.tests.base import BaseTestCase
from server.models import Pet, UserPet, Notification, UserNotification


class TestProfileAPI(BaseTestCase):
    def test_get_profile(self):
        headers = {"token": self.token}
        resp = self.client.get("/api/v2/profile", headers=headers)
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 200)
        self.assertIsNotNone(resp_data)

        self.assertEqual(self.user.id, resp_data["id"])
        self.assertEqual(self.user.first_name, resp_data["first_name"])
        self.assertEqual(self.user.last_name, resp_data["last_name"])
        self.assertEqual(self.user.email, resp_data["email"])
        self.assertEqual(
            self.user.profile_picture, resp_data["profile_picture"]
        )

    def test_patch_profile(self):
        headers = {"token": self.token}

        # Update first_name and last_name
        payload = {"first_name": "new_name", "last_name": "new_lastname"}
        resp = self.client.patch("/api/v2/profile/", json=payload, headers=headers)
        self.assertEqual(resp.status_code, 200)

        resp = self.client.get("/api/v2/profile", headers=headers)
        user = resp.json()

        self.assertIsNotNone(user)

        self.assertEqual(user["first_name"], payload["first_name"])
        self.assertEqual(user["last_name"], payload["last_name"])

        headers = {"token": f"{self.token}"}

        # Update empty body
        payload = {}
        resp = self.client.patch("/api/v2/profile/", json=payload, headers=headers)
        self.assertEqual(resp.status_code, 400)

    def test_profile_pets(self):
        pet_1 = Pet(
            name="woof",
            profile_picture="http://localhost",
            description="nomthing",
            specie_id=1,
            color="black",
        )

        self.db.add(pet_1)
        self.db.commit()

        self.db.add(UserPet(user_id=self.user.id, pet_id=pet_1.id))
        self.db.commit()

        headers = {"token": self.token}
        resp = self.client.get("/api/v2/profile/pets", headers=headers)
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 200)
        self.assertIsNotNone(resp_data)
        self.assertGreater(len(resp_data), 0)

    def test_profile_notifications(self):
        notification = Notification(type="SCANNED", scanned_pet_id=self.pet_1.id)
        self.db.add(notification)
        self.db.commit()
        self.db.add(
            UserNotification(user_id=self.user.id, notification_id=notification.id)
        )
        self.db.commit()

        headers = {"token": self.token}
        resp = self.client.get("/api/v2/profile/notifications", headers=headers)
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 200)
        self.assertIsNotNone(resp_data)
        self.assertGreater(len(resp_data), 0)
