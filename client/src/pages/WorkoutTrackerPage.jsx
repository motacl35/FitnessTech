import { useState } from "react";
import API_BASE from "../api/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setMessage("Account created. You can now log in.");

      setForm({
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("Registration error:", error);
      setError("Unable to connect to the server.");
    }
  }

  return (
    <main className="register-page">
      <section className="register-card">
        <p className="register-kicker">JOIN • TRAIN • IMPROVE</p>

        <h1 className="register-title">
          CREATE <span>ACCOUNT</span>
        </h1>

        <p className="register-description">
          Create your free FitnessTech account. Upgrade to a paid membership at
          any time to unlock saved workouts, saved AI conversations, and full
          member features.
        </p>

        <form onSubmit={handleSubmit} className="register-form">
          <label>
            Username
            <input
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value,
                })
              }
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Create a password"
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

          {error && <p className="register-error">{error}</p>}

          {message && <p className="register-success">{message}</p>}

          <button type="submit" className="register-submit">
            Register
          </button>
        </form>
      </section>
    </main>
  );
}
