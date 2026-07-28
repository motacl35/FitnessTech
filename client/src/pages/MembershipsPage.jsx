import { useEffect, useState } from "react";
import API_BASE from "../api/api";

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/memberships`)
      .then((res) => res.json())
      .then(setMemberships)
      .catch(console.error);
  }, []);

  return (
    <main className="page">
      <h1>Membership Tiers</h1>

      <div className="grid">
        {memberships.map((tier) => (
          <div className="card" key={tier._id}>
            <h2>{tier.name}</h2>
            <h3>{tier.price}</h3>
            <p>{tier.description}</p>

            <ul>
              {tier.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}