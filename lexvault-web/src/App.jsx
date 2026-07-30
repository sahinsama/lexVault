import { useState } from 'react'
import './App.css'
import WordCard from './components/WordCard'

function App() {

  const [word, setWord] = useState("")
  const [result, setResult] = useState(null)

  async function handleAnalyze() {

    if (!word.trim()) return

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
    )

    const data = await response.json()

    setResult(data)

  }


  return (
    <>
      <h1>LexVault</h1>

      <input
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter a word..."
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
  )
}

export default App