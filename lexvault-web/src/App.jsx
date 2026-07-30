import { useState } from 'react'
import './App.css'

function App() {

  const [word, setWord] = useState("")

async function handleAnalyze() {
  const response = await fetch(
    "http://localhost:3000/analyze",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        word: word,
      }),
    }
  );

  const data = await response.json();

  console.log(data);
}

  return (
    <>
      <h1>LexVault</h1>

      <input
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />

      <button onClick={handleAnalyze}>
        Analyze
      </button>
    </>
  )
}

export default App