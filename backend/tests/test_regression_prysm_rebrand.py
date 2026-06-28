"""
Regression backend tests after Prysm rebrand + requirements-prod.txt slim deps change.
Scope: admin login, health, token verify, applications list, accept endpoint validation.
Non-destructive: only validates endpoint shapes/contract; does not flip status of real apps.
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://keyperion-preview.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "admin@prysm-technologies.com"
ADMIN_PASSWORD = "Kp9!xRv2Lq@Zm7Tn4&Q"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(session):
    r = session.post(f"{BASE_URL}/api/admin/login",
                     json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data or "token" in data, f"Token missing in response: {data}"
    token = data.get("access_token") or data.get("token")
    assert isinstance(token, str) and len(token) > 10
    return token


# ---- Health ----
class TestHealth:
    def test_root_health(self, session):
        r = session.get(f"{BASE_URL}/api/", timeout=15)
        assert r.status_code == 200, f"Health check failed: {r.status_code} {r.text}"
        data = r.json()
        assert "message" in data
        assert isinstance(data["message"], str) and len(data["message"]) > 0


# ---- Admin auth ----
class TestAdminAuth:
    def test_admin_login_success(self, session):
        r = session.post(f"{BASE_URL}/api/admin/login",
                         json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
        assert r.status_code == 200, f"Body: {r.text}"
        data = r.json()
        token = data.get("access_token") or data.get("token")
        assert token and isinstance(token, str)

    def test_admin_login_wrong_password(self, session):
        r = session.post(f"{BASE_URL}/api/admin/login",
                         json={"email": ADMIN_EMAIL, "password": "definitelyWrong!"}, timeout=20)
        assert r.status_code in (400, 401, 403), f"Expected auth error, got {r.status_code}: {r.text}"

    def test_admin_verify_with_valid_token(self, session, admin_token):
        r = session.get(f"{BASE_URL}/api/admin/verify",
                        headers={"Authorization": f"Bearer {admin_token}"}, timeout=15)
        assert r.status_code == 200, f"Verify failed: {r.status_code} {r.text}"

    def test_admin_verify_without_token(self, session):
        r = session.get(f"{BASE_URL}/api/admin/verify", timeout=15)
        assert r.status_code in (401, 403, 422)


# ---- Applications list ----
class TestApplicationsList:
    def test_list_applications_requires_auth(self, session):
        r = session.get(f"{BASE_URL}/api/applications/", timeout=15)
        assert r.status_code in (401, 403), f"Expected unauthorized, got {r.status_code}"

    def test_list_applications_with_admin_token(self, session, admin_token):
        r = session.get(f"{BASE_URL}/api/applications/",
                        headers={"Authorization": f"Bearer {admin_token}"}, timeout=30)
        assert r.status_code == 200, f"List apps failed: {r.status_code} {r.text[:500]}"
        data = r.json()
        assert isinstance(data, list)
        # If any application exists verify no _id leak and basic fields
        if data:
            sample = data[0]
            assert "_id" not in sample, "MongoDB _id leaked in response"
            # Must have some core fields (best-effort)
            assert "id" in sample or "name" in sample or "email" in sample


# ---- Accept endpoint contract validation (non-destructive) ----
class TestAcceptContractValidation:
    """We do not accept a real application. We hit the endpoint with a fake id and
    verify it requires auth, and verify a non-existent id yields 404 (not 500),
    proving validation/handler path is intact."""

    def test_accept_requires_auth(self, session):
        r = session.post(f"{BASE_URL}/api/applications/nonexistent-id-xyz/accept",
                         json={"contract_type": "vollzeit"}, timeout=15)
        assert r.status_code in (401, 403), f"Expected unauthorized, got {r.status_code}: {r.text[:300]}"

    def test_accept_unknown_id_with_auth_returns_404(self, session, admin_token):
        r = session.post(
            f"{BASE_URL}/api/applications/nonexistent-id-xyz-{os.urandom(4).hex()}/accept",
            json={"contract_type": "vollzeit"},
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=20,
        )
        # Should be 404 (not found) or 400 (status mismatch) — never 500.
        assert r.status_code in (400, 404), f"Expected 400/404, got {r.status_code}: {r.text[:300]}"
        assert r.status_code != 500

    @pytest.mark.parametrize("ctype", [
        "vollzeit", "teilzeit", "minijob",
        "minijob_at", "vollzeit_at", "teilzeit_at", "freiberufler_at",
    ])
    def test_accept_endpoint_accepts_each_contract_type_value(self, session, admin_token, ctype):
        """Posting a valid contract_type against a non-existent app id should still
        be processed (404) — not 422/500 — proving the endpoint accepts that value."""
        r = session.post(
            f"{BASE_URL}/api/applications/nonexistent-{ctype}-{os.urandom(3).hex()}/accept",
            json={"contract_type": ctype},
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=20,
        )
        assert r.status_code in (400, 404), (
            f"contract_type={ctype} unexpected status {r.status_code}: {r.text[:200]}"
        )
