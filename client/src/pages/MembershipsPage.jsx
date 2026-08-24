
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../api/api";
import "./MembershipsPage.css";

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState([]);
  const navigate = useNavigate();

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

  function handleSelectMembership(tier) {
    sessionStorage.setItem(
      "selectedMembership",
      JSON.stringify(tier)
    );

    navigate("/register");
  }

  return (
    <main className="memberships-page">
      <section className="memberships-container">

        <div className="memberships-header">
          <p className="memberships-kicker">
            CHOOSE • TRAIN • IMPROVE
          </p>

          <h1 className="memberships-title">
            MEMBERSHIP <span>TIERS</span>
          </h1>

          <p className="memberships-description">
            Choose the membership plan that works best for your fitness goals.
          </p>
        </div>

        {memberships.length === 0 ? (
          <div className="memberships-loading">
            <p>Loading membership plans...</p>
          </div>
        ) : (
          <div className="memberships-grid">
            {memberships.map((tier) => (
              <article
                className="membership-card"
                key={tier._id}
              >
                <div className="membership-card-top">
                  <h2>{tier.name}</h2>

                  <h3>{tier.price}</h3>
                </div>

                <p className="membership-description">
                  {tier.description}
                </p>

                <div className="membership-divider"></div>

                <h4>What's Included</h4>

                <ul className="membership-benefits">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index}>
                      <span className="membership-check">
                        ✓
                      </span>

                      {benefit}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="membership-button"
                  onClick={() => handleSelectMembership(tier)}
                >
                  Choose Plan
                </button>
              </article>
            ))}
          </div>
        )}

      </section>
    </main>
  );
}