const rows = [
  { date: 'Today', mode: 'Live Sign Detection', words: 128, accuracy: '94%' },
  { date: 'Yesterday', mode: 'Meeting Mode', words: 842, accuracy: '91%' },
  { date: 'Monday', mode: 'Learning Mode', words: 76, accuracy: '96%' },
];

export function History() {
  return (
    <section className="card">
      <p className="eyebrow">History and exports</p>
      <h2>Saved conversations</h2>
      <div className="table-like">
        {rows.map((row) => (
          <article key={`${row.date}-${row.mode}`}>
            <span>{row.date}</span>
            <strong>{row.mode}</strong>
            <span>{row.words} words</span>
            <span>{row.accuracy}</span>
            <button type="button" className="secondary-button">Export PDF/DOCX</button>
          </article>
        ))}
      </div>
    </section>
  );
}
