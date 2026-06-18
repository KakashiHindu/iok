# Model card: SignBridge Temporal Gesture Classifier

## Intended use

Classify sign-language gestures from hand/pose landmark sequences and provide confidence-calibrated predictions for accessibility communication workflows.

## Inputs

- 21 MediaPipe hand landmarks per detected hand.
- Optional pose and face-expression landmarks for dynamic gestures and emotion-aware context.
- Temporal windows of 16-96 frames.

## Outputs

- Top-k sign labels.
- Confidence values.
- Landmark bounding boxes.
- Optional sentence-level gloss sequence for downstream translation.

## Architecture options

- Baseline: normalized landmark feature classifier.
- Production: Transformer encoder over temporal landmark windows.
- Research: Temporal Vision Transformer or CNN+LSTM fusion over video frames and landmarks.

## Evaluation

Track top-1/top-5 accuracy, sentence BLEU/chrF for generated text, latency p50/p95, FPS, calibration error, subgroup performance across skin tones, hand dominance, age groups, and language variants.

## Limitations

Sign languages are full natural languages with regional grammar and cultural variation. The model must be deployed with clear uncertainty, correction workflows, and human override.
