import { useEffect, useState } from "react";
import API_URL from "../config/api.js";
import { getAccessToken } from "../config/supabase.js";
import WordCard from "./wordcard.jsx";

function WordList() {
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const token = await getAccessToken();

        const res = await fetch(`${API_URL}/words`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("İstek başarısız");

        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("Beklenmeyen yanıt");

        setWords(data);
      } catch (err) {
        console.error("kelime listesi yüklenemedi:", err.message);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    }

    load();
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

  if (loadError) {
    return (
      <p className="list-status">
        arşiv yüklenemedi, sayfayı yenileyip tekrar dene.
      </p>
    );
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

      {words.length === 0 && (
        <p className="list-status">
          henüz kelime yok — "ekle" sekmesinden ilk kelimeni kaydet.
        </p>
      )}

      {words.length > 0 && filtered.length === 0 && (
        <p className="list-status">"{search}" ile eşleşen kelime yok.</p>
      )}

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