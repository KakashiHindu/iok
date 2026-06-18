# Online dataset strategy

The platform uses online public sign-language datasets through reproducible ingestion scripts. Dataset assets are large and licensing varies, so the repository stores only manifests, preprocessing code, and model/training configuration.

## Sources

| Dataset | Use | Access pattern |
| --- | --- | --- |
| WLASL | ASL isolated word and video metadata | Public GitHub metadata plus YouTube-hosted videos where available |
| MS-ASL | ASL large-scale video clips | Microsoft Research metadata and archive links |
| ASLLVD | ASL lexical video data | Boston University download pages/license flow |
| AUTSL | Turkish sign-language video dataset for temporal modeling robustness | Kaggle/API or official research archive |
| Indian Sign Language | ISL fingerspelling/gesture samples | Kaggle/API and academic mirrors |

## Pipeline

1. `download_datasets.py` resolves the dataset manifest, downloads metadata/assets, verifies checksums where provided, and records provenance.
2. `preprocess_landmarks.py` extracts MediaPipe hand/pose landmarks, applies smoothing, normalizes coordinates, and writes sequence tensors.
3. `augment_landmarks.py` applies safe temporal jitter, mirroring where language-appropriate, noise injection, and sequence cropping.
4. `train_temporal_transformer.py` trains the temporal classifier and logs metrics/artifacts to MLflow.
5. `export_onnx.py` exports optimized inference artifacts for server, browser, and edge runtimes.

## Licensing

Run dataset scripts only after accepting upstream dataset terms. Never commit raw dataset files, faces, audio, derived biometric features, or private user recordings.
