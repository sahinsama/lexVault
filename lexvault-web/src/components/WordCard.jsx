function WordCard({ word, result }) {
  const isDuplicate = result.isDuplicate;
  const count = result.count || 1;

  return (
    <div className="result-card">
      {isDuplicate ? (
        <span className="stamp">×{count} daha önce görüldü</span>
      ) : (
        <span className="stamp is-new">yeni kayıt</span>
      )}

      <div className="result-head">
        <h2 className="result-word">{word}</h2>

        <div className="result-meta">
          <span className="result-ipa">{result.pronunciation}</span>
          {result.type && <span className="tag">{result.type}</span>}
          {result.level && <span className="tag">{result.level}</span>}
        </div>
      </div>

      <div className="result-section">
        <label className="field-label">anlam</label>
        <p>{result.meaning}</p>
      </div>

      <div className="result-section example">
        <label className="field-label">örnek</label>
        <p>{result.example}</p>
      </div>

      {result.notes && (
        <div className="result-section notes">
          <label className="field-label">not</label>
          <p>{result.notes}</p>
        </div>
      )}
    </div>
  );
}

export default WordCard;
