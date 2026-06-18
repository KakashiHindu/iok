import type { AccessibilityState } from '../types';

export function Settings({ accessibility }: { accessibility: AccessibilityState }) {
  return (
    <section className="card settings-page">
      <p className="eyebrow">Settings</p>
      <h2>Production controls</h2>
      <div className="settings-grid">
        <article><strong>Languages</strong><span>English, Hindi, Hinglish, ASL, ISL; ready for Spanish, French, German, Japanese, Arabic.</span></article>
        <article><strong>AI pipeline</strong><span>MediaPipe landmarks, temporal classifier, Whisper speech, avatar pose generation.</span></article>
        <article><strong>Offline mode</strong><span>Queue conversations locally and sync once online. Browser model export supported through ONNX.</span></article>
        <article><strong>Accessibility enabled</strong><span>{Object.entries(accessibility).filter(([, value]) => value).map(([key]) => key).join(', ') || 'Default comfortable mode'}</span></article>
      </div>
    </section>
  );
}
