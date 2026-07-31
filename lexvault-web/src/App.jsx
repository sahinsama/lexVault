import { useState } from "react";
import "./App.css";
import WordCard from "./components/WordCard";

function App() {
  const [word, setWord] = useState("");
  const [source, setSource] = useState("");
  const [result, setResult] = useState(null);

  async function handleAnalyze() {
    if (!word.trim()) return;

    const response = await fetch(
      "https://lexvault-48l2.onrender.com/analyze",
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
  }

  return (
    <>
      <h1>LexVault</h1>

      <input
        type="text"
        placeholder="Enter a word..."
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />

      <input
        type="text"
        placeholder="Source (optional)"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />

      <button onClick={handleAnalyze}>
        Analyze
      </button>

      {result && (
        <WordCard
          word={word}
          result={result}
        />
      )}
    </>
  );
}

export default App;