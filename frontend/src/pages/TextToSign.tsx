import { useState } from 'react';
import { translateTextToSign } from '../api/client';
import { AvatarStage } from '../components/AvatarStage';
import type { LanguageCode, SignToken } from '../types';

const sampleTokens: SignToken[] = [
  { gloss: 'HOW', durationMs: 600, expression: 'question', handshape: 'open-palm' },
  { gloss: 'YOU', durationMs: 500, expression: 'neutral', handshape: 'point' },
  { gloss: 'QUESTION', durationMs: 400, expression: 'question', handshape: 'brows-up' },
];

export function TextToSign() {
  const [text, setText] = useState('How are you?');
  const [language, setLanguage] = useState<LanguageCode>('asl');
  const [tokens, setTokens] = useState<SignToken[]>(sampleTokens);
  const [speed, setSpeed] = useState(1);
  const [avatarMode, setAvatarMode] = useState<'male' | 'female' | 'child'>('female');
  const [skinTone, setSkinTone] = useState('#c6865a');
  const [clothes, setClothes] = useState('#f39b6d');

  async function generate() {
    try {
      const result = await translateTextToSign(text, language);
      setTokens(result.tokens);
    } catch {
      setTokens(text.split(/\s+/).filter(Boolean).map((word) => ({ gloss: word.toUpperCase(), durationMs: 520, expression: word.endsWith('?') ? 'question' : 'neutral', handshape: 'open-palm' })));
    }
  }

  return (
    <div className="split-grid">
      <section className="card">
        <p className="eyebrow">Text To Sign Language</p>
        <h2>Generate sign animation</h2>
        <label htmlFor="text-input">Enter text</label>
        <textarea id="text-input" value={text} onChange={(event) => setText(event.target.value)} />
        <div className="form-grid">
          <label>Language<select value={language} onChange={(event) => setLanguage(event.target.value as LanguageCode)}><option value="asl">ASL</option><option value="isl">ISL</option><option value="hi">Hindi</option><option value="hinglish">Hinglish</option></select></label>
          <label>Avatar<select value={avatarMode} onChange={(event) => setAvatarMode(event.target.value as 'male' | 'female' | 'child')}><option value="female">Female</option><option value="male">Male</option><option value="child">Child</option></select></label>
          <label>Speed<input type="range" min="0.5" max="2" step="0.1" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /></label>
          <label>Skin tone<input type="color" value={skinTone} onChange={(event) => setSkinTone(event.target.value)} /></label>
          <label>Clothes<input type="color" value={clothes} onChange={(event) => setClothes(event.target.value)} /></label>
        </div>
        <button type="button" className="primary-button" onClick={generate}>Generate AI Avatar Signs</button>
      </section>
      <AvatarStage tokens={tokens} mode={avatarMode} speed={speed} skinTone={skinTone} clothes={clothes} />
    </div>
  );
}
