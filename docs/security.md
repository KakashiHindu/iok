# Security, privacy, and accessibility controls

- Camera and microphone access are initiated only through explicit user actions.
- Raw frames/audio are processed in-memory by default and are not persisted unless a deployment explicitly enables governed retention.
- Conversation export excludes biometric landmark tensors unless a privileged research workflow enables it.
- Production deployments should use TLS, strict CORS allowlists, request-size limits, authentication, audit logging, and encrypted PostgreSQL storage.
- Redis stores short-lived session state only.
- Dataset ingestion keeps source URLs and licenses in provenance manifests.
- Accessibility is tested with keyboard-only navigation, ARIA labels, contrast modes, reduced-motion behavior, and screen-reader-friendly status regions.
