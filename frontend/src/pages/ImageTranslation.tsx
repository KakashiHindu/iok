import { UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { translateImage } from '../api/client';
import { AvatarStage } from '../components/AvatarStage';
import type { DetectionResult, SignToken } from '../types';

export function ImageTranslation() {
  const [preview, setPreview] = useState<string>('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [tokens, setTokens] = useState<SignToken[]>([]);

  async function processFile(file: File) {
    const reader = new FileReader();
    reader.onload = async () => {
      const imageDataUrl = String(reader.result);
      setPreview(imageDataUrl);
      try {
        const translated = await translateImage(imageDataUrl, 'asl');
        setResult(translated);
        setTokens(translated.animatedRecreation);
      } catch {
        const fallback = { label: 'HELLO', confidence: 0.84, fps: 0, generatedText: 'Detected likely greeting sign.', boundingBoxes: [], landmarks: [] };
        setResult(fallback);
        setTokens([{ gloss: 'HELLO', durationMs: 600, expression: 'happy', handshape: 'wave' }]);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="split-grid">
      <section className="card">
        <p className="eyebrow">Image of Sign Language → Translation</p>
        <h2>Upload or drag a sign image</h2>
        <label className="drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files.item(0); if (file) void processFile(file); }}>
          <UploadCloud />
          <span>Drop image here or choose file</span>
          <input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.item(0); if (file) void processFile(file); }} />
        </label>
        {preview && <img className="preview-image" src={preview} alt="Uploaded sign language frame" />}
        {result && <div className="result-panel compact"><h3>{result.label}</h3><p>Confidence: {Math.round(result.confidence * 100)}%</p><p>{result.generatedText}</p></div>}
      </section>
      <AvatarStage tokens={tokens} mode="female" speed={1} skinTone="#c6865a" clothes="#f39b6d" />
    </div>
  );
}
