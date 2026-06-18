import { Mic, Square } from 'lucide-react';
import { useRef, useState } from 'react';
import { AvatarStage } from '../components/AvatarStage';
import type { SignToken } from '../types';

export function SpeechToSign() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('Live transcript will appear here.');
  const [tokens, setTokens] = useState<SignToken[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  function startRecording() {
    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setTranscript('Browser speech recognition unavailable. Backend Whisper endpoint is ready for uploaded audio.');
      setTokens([{ gloss: 'SPEECH', durationMs: 500, expression: 'neutral', handshape: 'open-palm' }]);
      return;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';
    recognition.onresult = (event) => {
      const text = Array.from({ length: event.results.length }, (_, index) => event.results[index][0]?.transcript ?? '').join(' ');
      setTranscript(text);
      setTokens(text.split(/\s+/).filter(Boolean).slice(-8).map((word) => ({ gloss: word.toUpperCase(), durationMs: 500, expression: word.endsWith('?') ? 'question' : 'neutral', handshape: 'speech-derived' })));
    };
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  }

  function stopRecording() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsRecording(false);
  }

  return (
    <div className="split-grid">
      <section className="card">
        <p className="eyebrow">Speech To Sign Language</p>
        <h2>Whisper-ready speech pipeline</h2>
        <p>Speech → recognition → text processing → sign sequence → avatar animation. Supports English, Hindi, and Hinglish configuration.</p>
        <div className="control-row">
          <button type="button" className="primary-button" onClick={startRecording} disabled={isRecording}><Mic /> Start Microphone</button>
          <button type="button" className="secondary-button" onClick={stopRecording} disabled={!isRecording}><Square /> Stop</button>
        </div>
        <label htmlFor="transcript">Live transcript</label>
        <textarea id="transcript" readOnly value={transcript} />
      </section>
      <AvatarStage tokens={tokens} mode="male" speed={1} skinTone="#8d5524" clothes="#f7c873" />
    </div>
  );
}
