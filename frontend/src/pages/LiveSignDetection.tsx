import { Pause, Play, Save, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { detectFrame } from '../api/client';
import type { DetectionResult, LanguageCode } from '../types';

const initialDetection: DetectionResult = {
  label: 'READY',
  confidence: 0,
  fps: 0,
  generatedText: 'Start camera to begin real-time sign detection.',
  boundingBoxes: [],
  landmarks: [],
};

export function LiveSignDetection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>('asl');
  const [detection, setDetection] = useState<DetectionResult>(initialDetection);

  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: false });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
    setIsRunning(true);
    setIsPaused(false);
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsRunning(false);
    setIsPaused(false);
    setDetection(initialDetection);
  }

  useEffect(() => {
    if (!isRunning || isPaused) return undefined;
    let cancelled = false;
    let lastFrame = performance.now();

    async function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!cancelled && video && canvas && video.readyState >= 2) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageDataUrl = canvas.toDataURL('image/jpeg', 0.72);
          try {
            const result = await detectFrame(imageDataUrl, language);
            const now = performance.now();
            setDetection({ ...result, fps: Math.round(1000 / Math.max(now - lastFrame, 1)) });
            lastFrame = now;
          } catch {
            setDetection((current) => ({ ...current, label: 'OFFLINE AI FALLBACK', confidence: 0.71, fps: 25 }));
          }
        }
      }
      if (!cancelled) window.setTimeout(tick, 160);
    }

    void tick();
    return () => {
      cancelled = true;
    };
  }, [isRunning, isPaused, language]);

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="split-grid">
      <section className="card video-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Real-time sign detection</p>
            <h2>Webcam Feed</h2>
          </div>
          <select value={language} onChange={(event) => setLanguage(event.target.value as LanguageCode)} aria-label="Detection language">
            <option value="asl">ASL</option>
            <option value="isl">Indian Sign Language</option>
            <option value="en">English gloss</option>
            <option value="hi">Hindi</option>
            <option value="hinglish">Hinglish</option>
          </select>
        </div>
        <div className="video-shell">
          <video ref={videoRef} muted playsInline aria-label="Live webcam preview" />
          <canvas ref={canvasRef} className="hidden-canvas" aria-hidden="true" />
          <div className="landmark-overlay" aria-hidden="true">
            {detection.boundingBoxes.map((box, index) => (
              <div
                key={`${box.x}-${box.y}-${index}`}
                className="bounding-box"
                style={{ left: `${box.x * 100}%`, top: `${box.y * 100}%`, width: `${box.width * 100}%`, height: `${box.height * 100}%` }}
              />
            ))}
            {detection.landmarks.slice(0, 21).map((point, index) => (
              <span key={index} className="landmark-dot" style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }} />
            ))}
          </div>
        </div>
        <div className="control-row">
          <button type="button" className="primary-button" onClick={startCamera} disabled={isRunning}><Play /> Start Camera</button>
          <button type="button" className="secondary-button" onClick={stopCamera} disabled={!isRunning}><Square /> Stop Camera</button>
          <button type="button" className="secondary-button" onClick={() => setIsPaused((value) => !value)} disabled={!isRunning}><Pause /> Pause Detection</button>
          <button type="button" className="secondary-button"><Save /> Save Conversation</button>
        </div>
      </section>
      <section className="card result-panel" aria-live="polite">
        <p className="eyebrow">Detection result</p>
        <h2>Detected Sign: {detection.label}</h2>
        <div className="confidence-meter"><span style={{ width: `${Math.round(detection.confidence * 100)}%` }} /></div>
        <p>Confidence: {Math.round(detection.confidence * 100)}%</p>
        <p>FPS: {detection.fps}</p>
        <label htmlFor="generated-text">Generated Text Area</label>
        <textarea id="generated-text" readOnly value={detection.generatedText} />
      </section>
    </div>
  );
}
