from server.tests.base import BaseTestCase


class TestDataAPI(BaseTestCase):
    def test_get_species(self):
        resp = self.client.get("/api/v2/data/species")
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 200)

        self.assertIsNotNone(resp_data["data"])
