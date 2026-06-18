import { useEffect, useState } from 'react';
import { getAnalytics } from '../api/client';
import { EmergencyButtons } from '../components/EmergencyButtons';
import { MetricCard } from '../components/MetricCard';

const fallback = {
  accuracy: 0.93,
  sessionLengthMinutes: 18,
  wordsRecognized: 1248,
  commonSigns: ['HELLO', 'THANK YOU', 'HELP', 'WATER'],
  usageTrend: [8, 12, 15, 19, 23, 26, 31],
};

export function Dashboard({ onEmergency }: { onEmergency: (phrase: string) => void }) {
  const [analytics, setAnalytics] = useState(fallback);

  useEffect(() => {
    getAnalytics().then(setAnalytics).catch(() => setAnalytics(fallback));
  }, []);

  return (
    <div className="page-grid">
      <section className="hero-card">
        <p className="eyebrow">Futuristic communication assistant</p>
        <h2>Bidirectional sign-language communication for everyone</h2>
        <p>
          SignBridge AI connects sign, speech, text, image, and avatar-based communication in one accessible workflow.
        </p>
      </section>
      <div className="metric-grid">
        <MetricCard label="Detection accuracy" value={`${Math.round(analytics.accuracy * 100)}%`} detail="Targeting 90%+ with calibrated confidence" />
        <MetricCard label="Session length" value={`${analytics.sessionLengthMinutes} min`} detail="Real-time conversation analytics" />
        <MetricCard label="Words recognized" value={analytics.wordsRecognized.toLocaleString()} detail="Across sign, speech, and text" />
        <MetricCard label="FPS target" value="25+" detail="Under 200 ms latency budget" />
      </div>
      <EmergencyButtons onSend={onEmergency} />
      <section className="card">
        <p className="eyebrow">Common signs</p>
        <div className="tag-row">
          {analytics.commonSigns.map((sign) => (
            <span className="tag" key={sign}>{sign}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
