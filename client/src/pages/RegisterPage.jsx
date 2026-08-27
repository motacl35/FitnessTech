import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../api/api";


export default function RegisterPage({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

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
        setError(data.error || "Registration failed.");
        return;
      }

      /*
        Registration was successful.

        The server returns a JWT and username,
        so use the same login function used by LoginPage.
      */
      onLogin(data.token, data.username);

      /*
        Send the newly registered user directly
        to their profile page.
      */
      navigate("/profile");
    } catch (error) {
      console.error("Registration error:", error);
      setError("Unable to connect to the server.");
    }
  }

  return (
    <main className="register-page">
      <section className="register-card">
        <p className="register-kicker">
          JOIN • TRAIN • IMPROVE
        </p>

        <h1 className="register-title">
          CREATE <span>ACCOUNT</span>
        </h1>

        <p className="register-description">
          Create your free FitnessTech account. You can upgrade to a
          membership at any time to unlock additional features.
        </p>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Username */}
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

          {/* Email */}
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

          {/* Password */}
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

          {/* Registration Error */}
          {error && (
            <p className="register-error">
              {error}
            </p>
          )}

          {/* Register Button */}
          <button
            type="submit"
            className="register-submit"
          >
            Register
          </button>
        </form>
      </section>
    </main>
  );
}