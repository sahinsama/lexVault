import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext.jsx";
import "./login.css";

const LANGUAGES = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "ja", label: "日本語" },
];

function CompleteProfile() {
  const [username, setUsername] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("tr");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { completeProfile } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await completeProfile(username, nativeLanguage);
      navigate("/app", { state: { justLoggedIn: true } });
    } catch (err) {
      setError(err.message || "bir şeyler ters gitti");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="vault-mark small">
          lex<span>vault</span>
        </h1>

        <p className="login-info" style={{ marginBottom: 20 }}>
          son bir adım — profilini tamamla
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label">kullanıcı adı</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              disabled={isLoading}
            />
          </div>

          <div className="field">
            <label className="field-label">anadilin</label>
            <select
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value)}
              disabled={isLoading}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="submit-btn" disabled={isLoading}>
            {isLoading ? "bekle..." : "arşivimi aç"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;