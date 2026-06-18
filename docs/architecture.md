# Architecture

SignBridge AI is structured as a modular platform rather than a single-purpose demo.

## Runtime layers

1. **Client capture and accessibility UI**: React modules acquire camera/microphone input, show large controls, expose screen-reader status, render landmark overlays, and animate the Three.js avatar.
2. **FastAPI gateway**: Validates payloads, applies CORS/payload controls, and exposes stable contracts for web, desktop, and mobile clients.
3. **AI services**: MediaPipe extracts landmarks; PyTorch temporal models classify signs; Whisper-compatible speech recognition transcribes audio; text processing maps natural language into sign gloss sequences; avatar services convert glosses into animation tokens.
4. **Persistence and analytics**: PostgreSQL stores users, conversations, messages, model runs, and accessibility preferences; Redis supports low-latency realtime state.
5. **ML platform**: Dataset downloaders, preprocessing, augmentation, training, MLflow tracking, and ONNX export support research-grade iteration and edge deployment.

## Scalability path

- Split inference into GPU-backed workers behind the FastAPI gateway.
- Serve browser/edge ONNX models for offline mode.
- Store only derived transcripts by default; gate raw recordings behind explicit consent and retention policies.
- Add WebSocket streaming for sub-200 ms realtime translation after the initial REST contract is validated.
