import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabase.js";
import "./login.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

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
          yeni şifreni belirle
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label">yeni şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="submit-btn" disabled={isLoading}>
            {isLoading ? "bekle..." : "şifreyi güncelle"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;