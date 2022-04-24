from starlette.testclient import TestClient
from server.tests.base import BaseTestCase


class TestHealthAPI(BaseTestCase):
  def test_health(self):
    with TestClient(self.app) as client:
      resp = client.get('/api/v2/health')
      self.assertEqual(resp.status_code, 200)
      