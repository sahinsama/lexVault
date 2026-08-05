import { useState } from "react";
import "./App.css";
import WordCard from "./components/WordCard";
import WordList from "./components/WordList";
import API_URL from "./config/api";

function App() {
  const [word, setWord] = useState("");
  const [source, setSource] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState("add");

  async function handleAnalyze() {
    if (!word.trim()) return;
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word,
          source,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Analyze Error:", error);
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

      <div className="vault-nav">
        <button
          className={view === "add" ? "nav-btn active" : "nav-btn"}
          onClick={() => setView("add")}
        >
          ekle
        </button>

        <button
          className={view === "list" ? "nav-btn active" : "nav-btn"}
          onClick={() => setView("list")}
        >
          kelimelerim
        </button>
      </div>

      {view === "add" ? (
        <>
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
              <label className="field-label">
                kaynak (opsiyonel)
              </label>

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
              {isLoading
                ? "arşivleniyor..."
                : "arşive ekle"}
            </button>
          </div>

          {result && (
            <WordCard
              word={word}
              result={result}
            />
          )}
        </>
      ) : (
        <WordList />
      )}
    </div>
  );
}

export default App;