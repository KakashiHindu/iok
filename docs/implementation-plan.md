# SignBridge AI implementation plan

- Monorepo with React/TypeScript frontend, FastAPI backend, ML training/inference package, Docker Compose, and CI.
- AI integration uses MediaPipe hand landmarks, PyTorch temporal gesture classifier, Whisper-compatible speech transcription abstraction, and avatar/sign-sequence APIs.
- Online dataset ingestion is reproducible via manifests/scripts for WLASL, MS-ASL, ASLLVD, AUTSL, and Indian Sign Language sources; large assets are downloaded locally and never committed.
- Frontend provides the requested modules: dashboard, live detection, speech/text/image translation, conversation mode, history, settings, accessibility modes, analytics, and avatar controls.
- Backend exposes production API contracts for realtime detection, image translation, text/speech-to-sign, conversation sessions, analytics, emergency phrases, and dataset/training jobs.
