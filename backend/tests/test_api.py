import base64
import io

from fastapi.testclient import TestClient
from PIL import Image

from app.main import app

client = TestClient(app)


def _image_data_url() -> str:
    image = Image.new("RGB", (64, 64), color=(250, 210, 130))
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG")
    return "data:image/jpeg;base64," + base64.b64encode(buffer.getvalue()).decode("ascii")


def test_health() -> None:
    assert client.get("/api/v1/health").json()["status"] == "ok"


def test_text_to_sign() -> None:
    response = client.post("/api/v1/translation/text-to-sign", json={"text": "Need help", "language": "asl"})
    assert response.status_code == 200
    assert response.json()["tokens"][0]["gloss"] == "HELP"


def test_sign_frame_contract() -> None:
    response = client.post("/api/v1/translation/sign-frame", json={"image_data_url": _image_data_url(), "language": "asl"})
    assert response.status_code == 200
    payload = response.json()
    assert "label" in payload
    assert "confidence" in payload
    assert isinstance(payload["landmarks"], list)
