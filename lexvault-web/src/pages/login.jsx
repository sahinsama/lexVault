import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext.jsx";
import supabase from "../config/supabase.js";
import "./login.css";

const LANGUAGES = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "ja", label: "日本語" },
];

function Login() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("tr");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleGoogleSignIn() {
    setError("");

    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || "google girişi başarısız oldu");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setIsLoading(true);

    try {
      if (mode === "signup") {
        const data = await signUp(email, password, nativeLanguage, username);

        if (!data.session) {
          // email doğrulaması açık — kullanıcı henüz giriş yapamaz
          setInfo(
            "kayıt başarılı! e-postana gönderdiğimiz onay linkine tıklayıp giriş yaptığında arşivin hazır olacak."
          );
          setMode("signin");
        } else {
          navigate("/app", { state: { justLoggedIn: true } });
        }
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;

        setInfo("şifre sıfırlama linki e-postana gönderildi.");
      } else {
        await signIn(email, password);
        navigate("/app", { state: { justLoggedIn: true } });
      }
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

        {mode !== "forgot" && (
          <div className="login-tabs">
            <button
              type="button"
              className={mode === "signin" ? "login-tab active" : "login-tab"}
              onClick={() => {
                setMode("signin");
                setError("");
                setInfo("");
              }}
            >
              giriş yap
            </button>
            <button
              type="button"
              className={mode === "signup" ? "login-tab active" : "login-tab"}
              onClick={() => {
                setMode("signup");
                setError("");
                setInfo("");
              }}
            >
              kayıt ol
            </button>
          </div>
        )}

        {mode !== "forgot" && (
          <>
            <button
              type="button"
              className="google-btn"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              Google ile devam et
            </button>

            <div className="login-divider">
              <span>ya da</span>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label">e-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {mode !== "forgot" && (
            <div className="field">
              <label className="field-label">şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
          )}

          {mode === "signup" && (
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
          )}

          {mode === "signup" && (
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
          )}

          {error && <p className="login-error">{error}</p>}
          {info && <p className="login-info">{info}</p>}

          <button className="submit-btn" disabled={isLoading}>
            {isLoading
              ? "bekle..."
              : mode === "signup"
              ? "arşivini oluştur"
              : mode === "forgot"
              ? "sıfırlama linki gönder"
              : "giriş yap"}
          </button>
        </form>

        {mode === "signin" && (
          <button
            type="button"
            className="login-forgot"
            onClick={() => {
              setMode("forgot");
              setError("");
              setInfo("");
            }}
          >
            şifremi unuttum
          </button>
        )}

        {mode === "forgot" && (
          <button
            type="button"
            className="login-forgot"
            onClick={() => {
              setMode("signin");
              setError("");
              setInfo("");
            }}
          >
            ← girişe dön
          </button>
        )}
      </div>
    </div>
  );
}

export default Login;