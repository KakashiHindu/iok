from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image

try:
    from app.services.landmarks import create_landmark_extractor
except ModuleNotFoundError:
    import sys

    sys.path.append(str(Path(__file__).resolve().parents[2] / "backend"))
    from app.services.landmarks import create_landmark_extractor


def process_image(path: Path) -> np.ndarray:
    extractor = create_landmark_extractor()
    image = Image.open(path).convert("RGB")
    result = extractor.extract(image)
    points = [[point.x, point.y, point.z] for point in result.landmarks[:21]]
    if len(points) < 21:
        points.extend([[0.0, 0.0, 0.0]] * (21 - len(points)))
    return np.asarray(points, dtype=np.float32).reshape(-1)


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract normalized landmark features from dataset images/video frames.")
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--languages", nargs="*", default=["ASL", "ISL"])
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    manifest = []
    for image_path in args.input.rglob("*"):
        if image_path.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
            continue
        features = process_image(image_path)
        target = args.output / f"{image_path.stem}.npy"
        np.save(target, features)
        manifest.append({"source": str(image_path), "features": str(target), "languages": args.languages})
    (args.output / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
