import { useEffect, useState } from "react";
import API_URL from "../config/api.js";
import WordCard from "./wordcard.jsx";

function WordList() {
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/words`)
      .then((res) => res.json())
      .then((data) => {
        setWords(data);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setSelected(null);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const filtered = words.filter((w) =>
    w.word.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <p className="list-status">arşiv açılıyor...</p>;
  }

  return (
    <div className="word-list">
      <input
        type="text"
        className="list-search"
        placeholder="ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <p className="list-count">{filtered.length} kelime</p>

      {filtered.map((w, i) => (
        <button
          className="list-row"
          key={i}
          onClick={() => setSelected(w)}
        >
          <div className="list-row-head">
            <span className="list-row-word">{w.word}</span>
            <span className="result-ipa">{w.pronunciation}</span>
            {w.level && <span className="tag">{w.level}</span>}
            {w.count > 1 && <span className="tag tag-count">×{w.count}</span>}
          </div>
          <p className="list-row-meaning">{w.meaning}</p>
        </button>
      ))}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="modal-shell"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
              aria-label="kapat"
            >
              ×
            </button>

            <WordCard
              word={selected.word}
              result={{
                ...selected,
                isDuplicate: selected.count > 1,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default WordList;