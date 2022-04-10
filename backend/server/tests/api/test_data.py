from unittest import TestCase
import requests


class TestDataAPI(TestCase):
  def test_get_species(self):
    resp = requests.get('http://localhost:8000/api/v2/data/species')
    resp_data = resp.json()

    self.assertEqual(resp.status_code, 200)

    self.assertIsNone(resp_data["data"])