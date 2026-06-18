from dataclasses import dataclass
from typing import Protocol

import numpy as np
from PIL import Image

from app.schemas import BoundingBox, Landmark


@dataclass(frozen=True)
class LandmarkResult:
    landmarks: list[Landmark]
    bounding_boxes: list[BoundingBox]


class LandmarkExtractor(Protocol):
    def extract(self, image: Image.Image) -> LandmarkResult: ...


class HeuristicLandmarkExtractor:
    def extract(self, image: Image.Image) -> LandmarkResult:
        array = np.asarray(image.resize((160, 120))).astype(np.float32)
        brightness = array.mean(axis=2)
        threshold = float(np.percentile(brightness, 68))
        ys, xs = np.where(brightness >= threshold)
        if len(xs) == 0 or len(ys) == 0:
            return LandmarkResult(landmarks=[], bounding_boxes=[])
        x_min, x_max = xs.min() / 160, xs.max() / 160
        y_min, y_max = ys.min() / 120, ys.max() / 120
        width = max(x_max - x_min, 0.08)
        height = max(y_max - y_min, 0.08)
        landmarks = []
        for index in range(21):
            col = index % 5
            row = index // 5
            landmarks.append(
                Landmark(
                    x=min(max(x_min + width * (0.15 + col * 0.18), 0), 1),
                    y=min(max(y_min + height * (0.12 + row * 0.19), 0), 1),
                    z=float((row - 2) / 10),
                )
            )
        return LandmarkResult(
            landmarks=landmarks,
            bounding_boxes=[BoundingBox(x=float(x_min), y=float(y_min), width=float(width), height=float(height))],
        )


class MediaPipeLandmarkExtractor:
    def __init__(self) -> None:
        import mediapipe as mp

        self._mp_hands = mp.solutions.hands
        self._hands = self._mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5)

    def extract(self, image: Image.Image) -> LandmarkResult:
        result = self._hands.process(np.asarray(image))
        if not result.multi_hand_landmarks:
            return LandmarkResult(landmarks=[], bounding_boxes=[])
        landmarks: list[Landmark] = []
        boxes: list[BoundingBox] = []
        for hand in result.multi_hand_landmarks:
            points = [Landmark(x=lm.x, y=lm.y, z=lm.z) for lm in hand.landmark]
            landmarks.extend(points)
            xs = [point.x for point in points]
            ys = [point.y for point in points]
            boxes.append(BoundingBox(x=min(xs), y=min(ys), width=max(xs) - min(xs), height=max(ys) - min(ys)))
        return LandmarkResult(landmarks=landmarks, bounding_boxes=boxes)


def create_landmark_extractor() -> LandmarkExtractor:
    try:
        return MediaPipeLandmarkExtractor()
    except Exception:
        return HeuristicLandmarkExtractor()
