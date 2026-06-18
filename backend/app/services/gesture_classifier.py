from pathlib import Path

import numpy as np

from app.core.config import settings
from app.schemas import Landmark, LanguageCode

LABELS = ["HELLO", "THANK YOU", "YES", "NO", "HELP", "WATER", "DOCTOR", "HOW ARE YOU"]


class GestureClassifier:
    def __init__(self, model_path: Path | None = None) -> None:
        self.model_path = model_path or Path(settings.model_dir) / "gesture_transformer.pt"
        self._torch_model = None
        self._load_model()

    def _load_model(self) -> None:
        if not self.model_path.exists():
            return
        try:
            import torch

            self._torch_model = torch.jit.load(str(self.model_path), map_location="cpu")
            self._torch_model.eval()
        except Exception:
            self._torch_model = None

    def predict(self, landmarks: list[Landmark], language: LanguageCode) -> tuple[str, float]:
        if not landmarks:
            return "NO HAND DETECTED", 0.0
        features = np.array([[point.x, point.y, point.z] for point in landmarks], dtype=np.float32)
        if self._torch_model is not None:
            return self._predict_torch(features)
        return self._predict_baseline(features, language)

    def _predict_torch(self, features: np.ndarray) -> tuple[str, float]:
        import torch

        with torch.no_grad():
            tensor = torch.from_numpy(features).reshape(1, features.shape[0], 3)
            logits = self._torch_model(tensor)
            probs = torch.softmax(logits, dim=-1).cpu().numpy()[0]
        index = int(np.argmax(probs))
        return LABELS[index % len(LABELS)], float(probs[index])

    def _predict_baseline(self, features: np.ndarray, language: LanguageCode) -> tuple[str, float]:
        centroid = features[:, :2].mean(axis=0)
        spread = features[:, :2].std(axis=0).sum()
        dynamic_score = float(np.clip(spread * 4 + centroid[0] * 0.2, 0, 1))
        if language == LanguageCode.isl and centroid[1] < 0.45:
            label = "NAMASTE"
        elif spread > 0.31:
            label = "HELP"
        elif centroid[0] > 0.55:
            label = "THANK YOU"
        elif centroid[1] < 0.42:
            label = "HELLO"
        else:
            label = "HOW ARE YOU"
        confidence = 0.68 + dynamic_score * 0.26
        return label, float(np.clip(confidence, 0.0, 0.94))
