from server.tests.base import BaseTestCase


class TestDataAPI(BaseTestCase):
    def test_get_species(self):
        resp = self.client.get("/api/v2/data/species")
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 200)

        self.assertIsNotNone(resp_data)

    def test_get_breeds(self):
        resp = self.client.get("/api/v2/data/breeds?specie_id=1")
        resp_data = resp.json()

        self.assertEqual(resp.status_code, 200)

        self.assertIsNotNone(resp_data)

    def test_get_breeds_no_specie_id(self):
        resp = self.client.get("/api/v2/data/breeds")

        self.assertEqual(resp.status_code, 422)
