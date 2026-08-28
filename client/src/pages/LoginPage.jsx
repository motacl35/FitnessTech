import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../api/api";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [pin, setPin] = useState("");
  const [usePinMode, setUsePinMode] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");

    try {
      if (usePinMode) {
        const res = await fetch(`${API_BASE}/auth/pin-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.identifier, pin }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "PIN login failed");
          return;
        }

        onLogin(data.token, data.username);
        navigate("/profile");
        return;
      }

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      onLogin(data.token, data.username);
      navigate("/profile");
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the server.");
    }
  };

  async function handleCreatePin() {
    setError("");
    setInfoMessage("");

    if (!form.identifier) {
      setError("Enter your email to create a PIN.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/create-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.identifier }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create PIN");
        return;
      }

      setInfoMessage(data.message || "PIN created. Check your email for the PIN.");
      setUsePinMode(true);
    } catch (err) {
      setError("Network error creating PIN.");
    }
  }

  async function handleForgotPassword() {
    setError("");
    setInfoMessage("");

    if (!form.identifier) {
      setError("Enter your email to receive password reset instructions.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.identifier }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not request password reset");
        return;
      }

      setInfoMessage(data.message || "Password reset email sent. Check your inbox.");
    } catch (err) {
      setError("Network error requesting password reset.");
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">

        <p className="login-kicker">WELCOME BACK</p>

        <h1 className="login-title">
          LOGIN TO <span>FITNESS TECH</span>
        </h1>

        <p className="login-description">
          Sign in to access your profile, memberships, and workout tracker.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email/Username
            <input
              type="text"
              placeholder="Enter your email or username"
              value={form.identifier}
              onChange={(e) =>
                setForm({
                  ...form,
                  identifier: e.target.value,
                })
              }
              required
            />
          </label>

          {!usePinMode && (
            <label>
              Password
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                required
              />
            </label>
          )}

          {usePinMode && (
            <label>
              PIN
              <input
                type="text"
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
            </label>
          )}

          {error && <p className="login-error">{error}</p>}
          {infoMessage && <p className="login-info">{infoMessage}</p>}

          <button type="submit" className="login-submit">
            {usePinMode ? "Login with PIN" : "Login"}
          </button>

          <div className="forgot-inline">
            <button type="button" className="link-button" onClick={handleForgotPassword}>
              Forgot password?
            </button>

            <button type="button" className="link-button" onClick={handleCreatePin}>
              Create PIN to login
            </button>

            <button
              type="button"
              className="link-button"
              onClick={() => setUsePinMode((s) => !s)}
            >
              {usePinMode ? "Use password instead" : "Use PIN to login"}
            </button>
          </div>

        </form>
      </section>
    </main>
  );
}
