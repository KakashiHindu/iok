# API endpoints

Base path: `/api/v1`.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Service health check |
| POST | `/translation/sign-frame` | Translate a webcam/video frame into sign label, confidence, landmarks, generated text, and speech URL placeholder |
| POST | `/translation/image` | Translate an uploaded sign-language image and return animated avatar recreation tokens |
| POST | `/translation/text-to-sign` | Normalize text and generate a sign-token sequence for avatar playback |
| POST | `/translation/speech-to-sign` | Transcribe speech through Whisper-compatible service and generate sign tokens |
| GET | `/analytics/summary` | Dashboard metrics: accuracy, session length, words recognized, common signs, and usage trends |
| GET | `/datasets/catalog` | Online dataset source catalog with access and licensing notes |
| GET | `/sessions/{session_id}/messages` | List conversation messages for a session |
| POST | `/sessions/{session_id}/messages` | Save a conversation message |

## Inference contract

The frontend can run in progressive-enhancement mode. When the backend has MediaPipe/PyTorch/Whisper artifacts installed, it performs full AI inference. Without heavyweight local model dependencies, the same contracts return deterministic fallback predictions so UI, API, CI, and deployment wiring stay testable.
