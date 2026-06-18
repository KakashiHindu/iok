from __future__ import annotations

import argparse
from pathlib import Path

import yaml


def main() -> None:
    parser = argparse.ArgumentParser(description="Train SignBridge temporal landmark Transformer classifier.")
    parser.add_argument("--config", type=Path, required=True)
    args = parser.parse_args()
    config = yaml.safe_load(args.config.read_text(encoding="utf-8"))
    try:
        import mlflow
        import torch
        from torch import nn
    except Exception as exc:
        raise SystemExit("Install backend[ai] to train the PyTorch/MLflow model") from exc

    class TemporalClassifier(nn.Module):
        def __init__(self, landmark_dim: int, d_model: int, labels: int) -> None:
            super().__init__()
            self.proj = nn.Linear(landmark_dim, d_model)
            layer = nn.TransformerEncoderLayer(d_model=d_model, nhead=config["model"]["nhead"], batch_first=True)
            self.encoder = nn.TransformerEncoder(layer, num_layers=config["model"]["num_layers"])
            self.head = nn.Linear(d_model, labels)

        def forward(self, x: torch.Tensor) -> torch.Tensor:
            encoded = self.encoder(self.proj(x))
            return self.head(encoded.mean(dim=1))

    mlflow.set_experiment(config["experiment_name"])
    output_dir = Path(config["export"]["output_dir"])
    output_dir.mkdir(parents=True, exist_ok=True)
    with mlflow.start_run():
        model = TemporalClassifier(config["data"]["landmark_dim"], config["model"]["d_model"], labels=128)
        sample = torch.zeros(1, config["data"]["sequence_length"], config["data"]["landmark_dim"])
        traced = torch.jit.trace(model.eval(), sample)
        artifact = output_dir / "gesture_transformer.pt"
        traced.save(str(artifact))
        mlflow.log_params({"architecture": "TemporalTransformer", **config["model"]})
        mlflow.log_artifact(str(artifact))
        print(f"Saved initial trainable model artifact to {artifact}")


if __name__ == "__main__":
    main()
