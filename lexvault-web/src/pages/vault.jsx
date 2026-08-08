import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_URL from "../config/api.js";
import { getAccessToken } from "../config/supabase.js";
import { useAuth } from "../context/authcontext.jsx";
import WordCard from "../components/wordcard.jsx";
import WordList from "../components/wordlist.jsx";
import ProfileMenu from "../components/profilemenu.jsx";

function Vault() {
  const [word, setWord] = useState("");
  const [source, setSource] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState("add");
  const [showWelcome, setShowWelcome] = useState(false);

  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.justLoggedIn) {
      setShowWelcome(true);
      navigate(location.pathname, { replace: true, state: {} });

      const timer = setTimeout(() => setShowWelcome(false), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  async function handleAnalyze() {
    if (!word.trim()) return;
    if (isLoading) return;

    setIsLoading(true);

    try {
      const token = await getAccessToken();

      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          word,
          source,
        }),
      });

      const data = await response.json();
      setResult(data);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="vault">
      <header className="vault-header">
        <div className="vault-header-row">
          <div>
            <h1 className="vault-mark">
              lex<span>vault</span>
            </h1>
            <hr className="vault-rule" />
            <p className="vault-tagline">kişisel kelime arşivin</p>
          </div>

          <ProfileMenu />
        </div>
      </header>

      {showWelcome && (
        <div className="welcome-banner">giriş başarılı — hoş geldin</div>
      )}

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
        </>
      ) : (
        <WordList />
      )}
    </div>
  );
}

export default Vault;