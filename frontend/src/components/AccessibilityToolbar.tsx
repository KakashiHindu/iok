import type { AccessibilityState } from '../types';

const toggles: Array<{ key: keyof AccessibilityState; label: string }> = [
  { key: 'largeText', label: 'Large Text' },
  { key: 'highContrast', label: 'High Contrast' },
  { key: 'darkMode', label: 'Dark Mode' },
  { key: 'voiceFeedback', label: 'Voice Feedback' },
  { key: 'colorBlind', label: 'Color Blind Friendly' },
  { key: 'reducedMotion', label: 'Reduced Motion' },
];

export function AccessibilityToolbar({ state, onChange }: { state: AccessibilityState; onChange: (state: AccessibilityState) => void }) {
  return (
    <section className="accessibility-toolbar" aria-label="Accessibility settings">
      {toggles.map((toggle) => (
        <button
          type="button"
          key={toggle.key}
          className={state[toggle.key] ? 'pill active' : 'pill'}
          aria-pressed={state[toggle.key]}
          onClick={() => onChange({ ...state, [toggle.key]: !state[toggle.key] })}
        >
          {toggle.label}
        </button>
      ))}
    </section>
  );
}
