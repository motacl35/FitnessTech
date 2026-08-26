
import { useEffect, useState } from "react";
import API_BASE from "../api/api";


export default function RegisterPage() {
  const savedMembership = sessionStorage.getItem("selectedMembership");

  const selectedMembership = savedMembership
    ? JSON.parse(savedMembership)
    : null;

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    membershipId: selectedMembership?._id || "",
  });

  const [memberships, setMemberships] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/memberships`)
      .then((res) => res.json())
      .then((data) => {
        setMemberships(data);
      })
      .catch((error) => {
        console.error("Error loading memberships:", error);
      });
  }, []);

  function handleMembershipChange(e) {
    const membershipId = e.target.value;

    setForm({
      ...form,
      membershipId,
    });

    const changedMembership = memberships.find(
      (membership) => membership._id === membershipId
    );

    if (changedMembership) {
      sessionStorage.setItem(
        "selectedMembership",
        JSON.stringify(changedMembership)
      );
    }
  }

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
        membershipId: "",
      });

      sessionStorage.removeItem("selectedMembership");
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
          Create your FitnessTech account and choose the membership plan
          that works best for you.
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

          <label htmlFor="membership">
            Membership Tier
            <select
              id="membership"
              value={form.membershipId}
              onChange={handleMembershipChange}
              required
            >
              <option value="">Choose a membership</option>

              {memberships.map((membership) => (
                <option
                  key={membership._id}
                  value={membership._id}
                >
                  {membership.name} - {membership.price}
                </option>
              ))}
            </select>
          </label>

          {error && (
            <p className="register-error">
              {error}
            </p>
          )}

          {message && (
            <p className="register-success">
              {message}
            </p>
          )}

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