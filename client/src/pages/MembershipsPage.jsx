import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../api/api";

export default function MembershipsPage() {
  /* Membership Data */
  const [memberships, setMemberships] = useState([]);

  /* Navigation */
  const navigate = useNavigate();

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

  /* Select Membership */
  function handleSelectMembership(tier) {
    sessionStorage.setItem(
      "selectedMembership",
      JSON.stringify(tier)
    );

    navigate("/register");
  }

  return (
    <main className="page">
      {/* Membership Tiers */}
      <h1>Membership Tiers</h1>

      {/* Membership Grid */}
      <div className="grid">
        {memberships.map((tier) => (
          /* Membership Card */
          <div className="card" key={tier._id}>
            {/* Membership Name */}
            <h2>{tier.name}</h2>

            {/* Membership Price */}
            <h3>{tier.price}</h3>

            {/* Membership Description */}
            <p>{tier.description}</p>

            {/* Membership Benefits */}
            <ul>
              {tier.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>

            {/* Choose Membership Button */}
            <button
              type="button"
              className="membership-button"
              onClick={() => handleSelectMembership(tier)}
            >
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}