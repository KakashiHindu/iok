from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np


def augment(features: np.ndarray, seed: int) -> list[np.ndarray]:
    rng = np.random.default_rng(seed)
    noise = rng.normal(0, 0.015, size=features.shape).astype(np.float32)
    jittered = np.clip(features + noise, -1, 1)
    scaled = features * rng.uniform(0.94, 1.06)
    return [jittered.astype(np.float32), scaled.astype(np.float32)]


def main() -> None:
    parser = argparse.ArgumentParser(description="Apply safe landmark augmentations for sign-language training.")
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    for index, source in enumerate(args.input.glob("*.npy")):
        features = np.load(source)
        for aug_index, augmented in enumerate(augment(features, index)):
            np.save(args.output / f"{source.stem}_aug{aug_index}.npy", augmented)


if __name__ == "__main__":
    main()
