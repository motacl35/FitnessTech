import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../api/api";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
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
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to connect to the server.");
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="login-kicker">
          WELCOME BACK
        </p>

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

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button type="submit" className="login-submit">
            Login
          </button>
        </form>
      </section>
    </main>
  );
}