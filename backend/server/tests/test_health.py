from server.tests.base import BaseTestCase


class TestHealthAPI(BaseTestCase):
    def test_health(self):
        response = self.client.get("/api/v2/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
