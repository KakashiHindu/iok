import { useMemo, useState } from 'react';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { Sidebar } from './components/Sidebar';
import { ConversationMode } from './pages/ConversationMode';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { ImageTranslation } from './pages/ImageTranslation';
import { LiveSignDetection } from './pages/LiveSignDetection';
import { Settings } from './pages/Settings';
import { SpeechToSign } from './pages/SpeechToSign';
import { TextToSign } from './pages/TextToSign';
import type { AccessibilityState, NavigationKey } from './types';

const defaultAccessibility: AccessibilityState = {
  largeText: false,
  highContrast: false,
  darkMode: false,
  voiceFeedback: false,
  colorBlind: false,
  reducedMotion: false,
};

export function App() {
  const [active, setActive] = useState<NavigationKey>('dashboard');
  const [accessibility, setAccessibility] = useState(defaultAccessibility);
  const [announcement, setAnnouncement] = useState('SignBridge AI loaded.');

  const className = useMemo(() => {
    const classes = ['app-shell'];
    if (accessibility.largeText) classes.push('large-text');
    if (accessibility.highContrast) classes.push('high-contrast');
    if (accessibility.darkMode) classes.push('dark-mode');
    if (accessibility.colorBlind) classes.push('color-blind');
    if (accessibility.reducedMotion) classes.push('reduced-motion');
    return classes.join(' ');
  }, [accessibility]);

  function sendEmergencyPhrase(phrase: string) {
    setAnnouncement(`${phrase} selected and converted to speech plus avatar sign.`);
    if (accessibility.voiceFeedback && 'speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(phrase));
    }
  }

  return (
    <div className={className}>
      <Sidebar active={active} onNavigate={setActive} />
      <main className="main-content">
        <AccessibilityToolbar state={accessibility} onChange={setAccessibility} />
        <div className="sr-only" aria-live="polite">{announcement}</div>
        {active === 'dashboard' && <Dashboard onEmergency={sendEmergencyPhrase} />}
        {active === 'live' && <LiveSignDetection />}
        {active === 'speech' && <SpeechToSign />}
        {active === 'text' && <TextToSign />}
        {active === 'image' && <ImageTranslation />}
        {active === 'conversation' && <ConversationMode />}
        {active === 'history' && <History />}
        {active === 'settings' && <Settings accessibility={accessibility} />}
      </main>
    </div>
  );
}
