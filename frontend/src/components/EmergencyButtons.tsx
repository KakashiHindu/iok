const phrases = ['Need Water', 'Need Help', 'Call Doctor', 'Thank You'];

export function EmergencyButtons({ onSend }: { onSend: (phrase: string) => void }) {
  return (
    <section className="card emergency" aria-label="Emergency quick communication buttons">
      <div>
        <p className="eyebrow">Quick communication</p>
        <h2>Emergency phrases</h2>
      </div>
      <div className="quick-grid">
        {phrases.map((phrase) => (
          <button type="button" className="quick-button" key={phrase} onClick={() => onSend(phrase)}>
            {phrase}
          </button>
        ))}
      </div>
    </section>
  );
}
