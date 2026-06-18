from __future__ import annotations

import argparse
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description="Export trained SignBridge model to ONNX for edge/web inference.")
    parser.add_argument("--checkpoint", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--sequence-length", type=int, default=64)
    parser.add_argument("--landmark-dim", type=int, default=63)
    args = parser.parse_args()
    try:
        import torch
    except Exception as exc:
        raise SystemExit("Install backend[ai] to export ONNX models") from exc
    model = torch.jit.load(str(args.checkpoint), map_location="cpu")
    sample = torch.zeros(1, args.sequence_length, args.landmark_dim)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    torch.onnx.export(model, sample, str(args.output), input_names=["landmarks"], output_names=["logits"], dynamic_axes={"landmarks": {1: "frames"}})
    print(f"Exported {args.output}")


if __name__ == "__main__":
    main()
