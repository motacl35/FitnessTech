import { useEffect, useState } from "react";
import API_BASE from "../api/api";

export default function RegisterPage() {
  /* Saved Membership */
  const savedMembership = sessionStorage.getItem("selectedMembership");

  /* Convert Saved Membership Into an Object */
  const selectedMembership = savedMembership
    ? JSON.parse(savedMembership)
    : null;

  /* Registration Form */
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    membershipId: selectedMembership?._id || "",
  });

  /* Membership Tiers */
  const [memberships, setMemberships] = useState([]);

  /* Success and Error Messages */
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* Get Membership Tiers */
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

  /* Handle Membership Change */
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

  /* Submit Registration Form */
  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      /* Send Registration Request */
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      /* Read Server Response */
      const data = await res.json();

      /* Handle Registration Error */
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      /* Show Success Message */
      setMessage("Account created. You can now log in.");

      /* Clear Registration Form */
      setForm({
        username: "",
        email: "",
        password: "",
        membershipId: "",
      });

      /* Remove Saved Membership */
      sessionStorage.removeItem("selectedMembership");
    } catch (error) {
      console.error("Registration error:", error);
      setError("Unable to connect to the server.");
    }
  }

  return (
    <main className="page">
      <form onSubmit={handleSubmit} className="card">
        {/* Create Account Heading */}
        <h1>Create Account</h1>

        {/* Username Input */}
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
          required
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
          required
        />

        {/* Membership Selection */}
        <label htmlFor="membership">
          Membership Tier
        </label>

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

        {/* Error Message */}
        {error && <p className="error">{error}</p>}

        {/* Success Message */}
        {message && <p className="success">{message}</p>}

        {/* Register Button */}
        <button type="submit">
          Register
        </button>
      </form>
    </main>
  );
}