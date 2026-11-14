import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authcontext.jsx";
import "./login.css";
import "./settings.css";

function Settings() {
  const { user, profile, updateUsername, updatePassword } = useAuth();

  const [username, setUsername] = useState(profile?.username || "");
  const [usernameMsg, setUsernameMsg] = useState({ type: "", text: "" });
  const [usernameLoading, setUsernameLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

  async function handleUsername(e) {
    e.preventDefault();
    setUsernameMsg({ type: "", text: "" });

    const clean = username.trim();

    if (clean === profile?.username) {
      setUsernameMsg({ type: "info", text: "kullanıcı adın zaten bu." });
      return;
    }

    setUsernameLoading(true);

    try {
      await updateUsername(clean);
      setUsernameMsg({ type: "info", text: "kullanıcı adın güncellendi." });
    } catch (err) {
      setUsernameMsg({
        type: "error",
        text: err.message || "bir şeyler ters gitti",
      });
    } finally {
      setUsernameLoading(false);
    }
  }

  async function handlePassword(e) {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (password !== passwordAgain) {
      setPasswordMsg({ type: "error", text: "şifreler eşleşmiyor." });
      return;
    }

    setPasswordLoading(true);

    try {
      await updatePassword(password);
      setPassword("");
      setPasswordAgain("");
      setPasswordMsg({ type: "info", text: "şifren güncellendi." });
    } catch (err) {
      setPasswordMsg({
        type: "error",
        text: err.message || "bir şeyler ters gitti",
      });
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-wrap">
        <Link to="/app" className="settings-back">
          ← arşive dön
        </Link>

        <h1 className="settings-title">ayarlar</h1>

        <section className="settings-section">
          <p className="field-label">e-posta</p>
          <p className="settings-readonly">{user?.email}</p>
        </section>

        <section className="settings-section">
          <form onSubmit={handleUsername}>
            <div className="field">
              <label className="field-label">kullanıcı adı</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                disabled={usernameLoading}
              />
            </div>

            {usernameMsg.text && (
              <p
                className={
                  usernameMsg.type === "error" ? "login-error" : "login-info"
                }
              >
                {usernameMsg.text}
              </p>
            )}

            <button className="submit-btn" disabled={usernameLoading}>
              {usernameLoading ? "bekle..." : "kullanıcı adını güncelle"}
            </button>
          </form>
        </section>

        <section className="settings-section">
          <form onSubmit={handlePassword}>
            <div className="field">
              <label className="field-label">yeni şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={passwordLoading}
              />
            </div>

            <div className="field">
              <label className="field-label">yeni şifre (tekrar)</label>
              <input
                type="password"
                value={passwordAgain}
                onChange={(e) => setPasswordAgain(e.target.value)}
                required
                minLength={6}
                disabled={passwordLoading}
              />
            </div>

            {passwordMsg.text && (
              <p
                className={
                  passwordMsg.type === "error" ? "login-error" : "login-info"
                }
              >
                {passwordMsg.text}
              </p>
            )}

            <button className="submit-btn" disabled={passwordLoading}>
              {passwordLoading ? "bekle..." : "şifreyi güncelle"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Settings;