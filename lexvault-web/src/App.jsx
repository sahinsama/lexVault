import { useState } from "react";
import "./App.css";
import WordCard from "./components/WordCard";

function App() {
  const [word, setWord] = useState("");
  const [source, setSource] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAnalyze() {
    if (!word.trim()) return;
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch(
            "http://localhost:3000/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            word,
            source,
          }),
        }
      );

      const data = await response.json();
      setResult(data);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="vault">
      <header className="vault-header">
        <h1 className="vault-mark">
          lex<span>vault</span>
        </h1>
        <hr className="vault-rule" />
        <p className="vault-tagline">kişisel kelime arşivin</p>
      </header>

      <div className="entry-card">
        <div className="field">
          <label className="field-label">kelime</label>
          <input
            type="text"
            placeholder="bir kelime yaz..."
            value={word}
            onChange={(e) => setWord(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="field">
          <label className="field-label">kaynak (opsiyonel)</label>
          <input
            type="text"
            placeholder="nerede gördün?"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          className="submit-btn"
          onClick={handleAnalyze}
          disabled={isLoading}
        >
          {isLoading ? "arşivleniyor..." : "arşive ekle"}
        </button>
      </div>

      {result && <WordCard word={word} result={result} />}
    </div>
  );
}

export default App;