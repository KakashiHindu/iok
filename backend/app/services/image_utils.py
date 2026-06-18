import base64
import io

from PIL import Image


def decode_data_url_image(image_data_url: str) -> Image.Image:
    if "," in image_data_url:
        _, encoded = image_data_url.split(",", 1)
    else:
        encoded = image_data_url
    image_bytes = base64.b64decode(encoded)
    return Image.open(io.BytesIO(image_bytes)).convert("RGB")
