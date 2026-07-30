function WordCard({ word, result }) {

  return (
    <div className="word-card">

      <div className="word-header">
        <h2>{word}</h2>
        <span>{result.level}</span>
      </div>

      <p className="pronunciation">
        {result.pronunciation}
      </p>


      <div className="section">
        <h3>Meaning</h3>
        <p>{result.meaning}</p>
      </div>


      <div className="section">
        <h3>Example</h3>
        <p>{result.example}</p>
      </div>


      <div className="section">
        <h3>Notes</h3>
        <p>{result.notes}</p>
      </div>


      <div className="meta">
        <span>{result.type}</span>
      </div>

    </div>
  )
}

export default WordCard