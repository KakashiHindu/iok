import { useState } from 'react';
import { AvatarStage } from '../components/AvatarStage';
import type { ConversationMessage, SignToken } from '../types';

const seedMessages: ConversationMessage[] = [
  { id: '1', speaker: 'assistant', modality: 'text', text: 'Conversation mode ready.', timestamp: new Date().toISOString() },
];

export function ConversationMode() {
  const [messages, setMessages] = useState(seedMessages);
  const [tokens, setTokens] = useState<SignToken[]>([]);

  function addMessage(text: string, speaker: ConversationMessage['speaker'], modality: ConversationMessage['modality']) {
    setMessages((current) => [...current, { id: crypto.randomUUID(), speaker, modality, text, timestamp: new Date().toISOString(), confidence: 0.91 }]);
    setTokens(text.split(/\s+/).filter(Boolean).map((word) => ({ gloss: word.toUpperCase(), durationMs: 500, expression: word.endsWith('?') ? 'question' : 'neutral', handshape: 'conversation' })));
  }

  return (
    <div className="conversation-layout">
      <section className="card participant-panel">
        <p className="eyebrow">Left side</p>
        <h2>Deaf User</h2>
        <div className="placeholder-feed">Webcam sign stream</div>
        <button type="button" className="primary-button" onClick={() => addMessage('Need help please', 'deaf-user', 'sign')}>Simulate Sign → Text/Speech</button>
      </section>
      <section className="card participant-panel">
        <p className="eyebrow">Right side</p>
        <h2>Hearing User</h2>
        <AvatarStage tokens={tokens} mode="child" speed={1} skinTone="#d2a679" clothes="#f7c873" />
        <button type="button" className="secondary-button" onClick={() => addMessage('I can help you now', 'hearing-user', 'speech')}>Simulate Speech → Sign</button>
      </section>
      <section className="card chat-panel">
        <p className="eyebrow">Conversation transcript</p>
        {messages.map((message) => (
          <article className={`chat-bubble ${message.speaker}`} key={message.id}>
            <strong>{message.speaker.replace('-', ' ')}</strong>
            <p>{message.text}</p>
            <span>{message.modality}{message.confidence ? ` · ${Math.round(message.confidence * 100)}%` : ''}</span>
          </article>
        ))}
      </section>
    </div>
  );
}
