
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../api/api";


export default function MembershipsPage() {
  const SAMPLE_TIERS = [
    { _id: "s1", name: 'Basic', price: '$9/mo', description: 'Access to basic workouts and community.', benefits: ['Access library', 'Community'] },
    { _id: "s2", name: 'Standard', price: '$19/mo', description: 'Includes classes, workout plans.', benefits: ['Classes','Workout plans'] },
    { _id: "s3", name: 'Pro', price: '$39/mo', description: 'Personalized plans and priority support.', benefits: ['Personalized plans','Priority support'] },
    { _id: "s4", name: 'Elite', price: '$69/mo', description: '1:1 coaching and advanced programs.', benefits: ['1:1 coaching','Advanced programs'] }
  ];
  const [memberships, setMemberships] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [answers, setAnswers] = useState({
    goals: [],
    frequency: "",
    weight: "",
    age: "",
    sex: "",
    strengths: [],
    weaknesses: [],
  });
  const [skipMode, setSkipMode] = useState(false);
  const [validationError, setValidationError] = useState("");
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

  function toggleArrayField(field, value) {
    setAnswers((prev) => {
      const arr = prev[field] || [];
      if (arr.includes(value)) {
        setValidationError("");
        return { ...prev, [field]: arr.filter((v) => v !== value) };
      }
      setValidationError("");
      return { ...prev, [field]: [...arr, value] };
    });
  }

  function handleChangeField(field, value) {
    setValidationError("");
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }

  function toggleSingleField(field, value) {
    setValidationError("");
    setAnswers((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value,
    }));
  }

  function computeRecommendation() {
    // Simple scoring rules
    let score = 0;

    const goalWeights = {
      "Weight Loss": 2,
      "Muscle Gain": 2,
      Endurance: 1,
      Flexibility: 1,
      "General Health": 1,
    };

    (answers.goals || []).forEach((g) => {
      score += goalWeights[g] || 0;
    });

    if (answers.frequency === "1-2") score += 0;
    if (answers.frequency === "3-4") score += 1;
    if (answers.frequency === "5+") score += 2;

    if (answers.strengths.includes("Consistency")) score += 1;
    if (answers.strengths.includes("Experience")) score += 1;

    if (answers.weaknesses.includes("Injury")) score -= 1;
    if (answers.weaknesses.includes("Time")) score -= 1;

    // Age/weight factors
    const age = parseInt(answers.age || "0", 10) || 0;
    const weight = parseFloat(answers.weight || "0") || 0;

    if (age > 60) score -= 1;
    if (age < 25) score += 1;

    // Map score to available memberships
    const count = memberships.length || 1;

    // normalize score to 0..1 by clamping against expected range
    const minScore = -3;
    const maxScore = 8;
    const normalized = Math.max(0, Math.min(1, (score - minScore) / (maxScore - minScore)));

    // sort memberships by numeric price if possible
    const sorted = [...memberships].sort((a, b) => {
      const pa = parseFloat((a.price || "").replace(/[^0-9.]/g, "")) || 0;
      const pb = parseFloat((b.price || "").replace(/[^0-9.]/g, "")) || 0;
      return pa - pb;
    });

    const idx = Math.round(normalized * (count - 1));
    let recommended = sorted[Math.max(0, Math.min(sorted.length - 1, idx))] || null;

    // Apply rule-based overrides for clearer mapping
    if (answers.goals.includes("Muscle Gain")) {
      recommended = sorted[sorted.length - 1] || recommended;
    } else if (answers.goals.includes("Weight Loss")) {
      recommended = sorted[Math.max(0, Math.floor((sorted.length - 1) / 2))] || recommended;
    } else if (answers.goals.includes("General Health") && answers.frequency === "1-2") {
      recommended = sorted[0] || recommended;
    }

    setRecommendation({ score, recommended });
  }

  // Recommendation runs only when user clicks the button

  // helper to check if a tier matches the recommended one
  function isRecommended(tier) {
    if (!recommendation || !recommendation.recommended) return false;
    const rec = recommendation.recommended;
    if (tier._id && rec._id) return tier._id === rec._id;
    return tier.name === rec.name;
  }

  // Find a tier by canonical name (case-insensitive). Fallback to index mapping.
  function findTierByName(tiers, name, fallbackIndex) {
    if (!tiers || tiers.length === 0) return null;
    const found = tiers.find((t) => (t.name || "").toLowerCase() === (name || "").toLowerCase());
    if (found) return found;
    // fallback by index into sorted tiers
    const idx = Math.max(0, Math.min(tiers.length - 1, fallbackIndex || 0));
    return tiers[idx] || null;
  }

  // Compute recommendation mapping to named tiers when user presses the button
  function computeRecommendationForButton() {
    // validation: if not skipping, all questionnaire fields must be filled
    if (!skipMode) {
      const requiredFilled = (answers.goals && answers.goals.length > 0)
        && answers.frequency
        && answers.age
        && answers.weight
        && answers.sex;
      if (!requiredFilled) {
        setValidationError("Please complete all questionnaire fields before requesting a recommendation.");
        return;
      }
      setValidationError("");
    }
    // compute baseline recommendation using previous scoring logic
    let score = 0;

    const goalWeights = {
      "Weight Loss": 2,
      "Muscle Gain": 2,
      Endurance: 1,
      Flexibility: 1,
      "General Health": 1,
    };

    (answers.goals || []).forEach((g) => {
      score += goalWeights[g] || 0;
    });

    if (answers.frequency === "1-2") score += 0;
    if (answers.frequency === "3-4") score += 1;
    if (answers.frequency === "5+") score += 2;

    if (answers.strengths.includes("Consistency")) score += 1;
    if (answers.strengths.includes("Experience")) score += 1;

    if (answers.weaknesses.includes("Injury")) score -= 1;
    if (answers.weaknesses.includes("Time")) score -= 1;

    const age = parseInt(answers.age || "0", 10) || 0;
    if (age > 60) score -= 1;
    if (age < 25) score += 1;

    // use fetched memberships if available, otherwise sample tiers
    const source = (memberships && memberships.length) ? memberships : SAMPLE_TIERS;

    // sort by numeric price
    const sorted = [...source].sort((a, b) => {
      const pa = parseFloat((a.price || "").replace(/[^0-9.]/g, "")) || 0;
      const pb = parseFloat((b.price || "").replace(/[^0-9.]/g, "")) || 0;
      return pa - pb;
    });

    // Determine target named tier
    let targetName = null;

    if (answers.goals.includes("Muscle Gain")) {
      targetName = age < 30 && answers.frequency === "5+" ? "Elite" : "Pro";
    } else if (answers.goals.includes("Weight Loss")) {
      targetName = (answers.frequency === "5+" || answers.strengths.includes("Consistency")) ? "Pro" : "Standard";
    } else if (answers.goals.includes("Endurance")) {
      targetName = answers.frequency === "5+" ? "Pro" : "Standard";
    } else if (answers.goals.includes("Flexibility")) {
      targetName = "Standard";
    } else if (answers.goals.includes("General Health")) {
      targetName = answers.frequency === "1-2" ? "Basic" : "Standard";
    } else {
      // fallback to score-based index
      const count = sorted.length || 1;
      const minScore = -3;
      const maxScore = 8;
      const normalized = Math.max(0, Math.min(1, (score - minScore) / (maxScore - minScore)));
      const idx = Math.round(normalized * (count - 1));
      // map index to approximate named tiers
      if (idx === 0) targetName = "Basic";
      else if (idx === count - 1) targetName = "Elite";
      else if (idx >= Math.floor((count - 1) / 2)) targetName = "Pro";
      else targetName = "Standard";
    }

    // adjust for age: if very old, step down one tier
    if (age >= 65) {
      if (targetName === "Elite") targetName = "Pro";
      else if (targetName === "Pro") targetName = "Standard";
    }

    // Try to find named tier in fetched list
    const nameToIndex = { Basic: 0, Standard: 1, Pro: 2, Elite: 3 };
    let recommendedTier = findTierByName(sorted, targetName, nameToIndex[targetName] || 0);
    if (!recommendedTier) {
      recommendedTier = sorted[0] || null;
    }

    setRecommendation({ score, recommended: recommendedTier, targetName });

    // show recommendation then auto-advance after short delay so user sees it
      // Do NOT auto-advance. Show recommendation and let user choose to register.
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

        <section className="recommendation-panel">
          <div className="skip-panel">
            <label className="skip-toggle">
              <input
                type="checkbox"
                checked={skipMode}
                onChange={(e) => setSkipMode(e.target.checked)}
              />
              Skip questionnaire — pick a membership directly
            </label>

            {skipMode && (
              <div className="skip-grid">
                {(memberships.length ? memberships : SAMPLE_TIERS).map((tier, idx) => (
                  <article
                    key={tier._id || idx}
                    className={`membership-card ${isRecommended(tier) ? 'highlight' : ''}`}
                  >
                    {isRecommended(tier) && (
                      <div className="recommended-badge">Recommended</div>
                    )}

                    <div className="membership-card-top">
                      <h2>{tier.name}</h2>
                      <h3>{tier.price}</h3>
                    </div>

                    <p className="membership-description">{tier.description}</p>

                    <div className="membership-divider"></div>

                    <h4>What's Included</h4>

                    <ul className="membership-benefits">
                      {(Array.isArray(tier.benefits) ? tier.benefits : []).map((benefit, index) => (
                        <li key={index}>
                          <span className="membership-check">✓</span>
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
          </div>
          {!skipMode && (
            <>
              <h2>Get a Membership Recommendation</h2>

              <div className="question">
            <label>Goals</label>
            <div className="options">
              {['Weight Loss','Muscle Gain','Endurance','Flexibility','General Health'].map((g) => (
                <button
                  key={g}
                  type="button"
                  className={answers.goals.includes(g) ? 'option selected' : 'option'}
                  onClick={() => toggleArrayField('goals', g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="question">
            <label>How often do you work out per week?</label>
            <div className="options">
              {['1-2','3-4','5+'].map((f) => (
                <button
                  key={f}
                  type="button"
                  className={answers.frequency === f ? 'option selected' : 'option'}
                  onClick={() => toggleSingleField('frequency', f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="question two-col">
            <label>
              Age
              <input
                type="number"
                value={answers.age}
                onChange={(e) => handleChangeField('age', e.target.value)}
                placeholder="e.g. 30"
              />
            </label>

            <label>
              Weight (lbs)
              <input
                type="number"
                value={answers.weight}
                onChange={(e) => handleChangeField('weight', e.target.value)}
                placeholder="e.g. 170"
              />
            </label>
          </div>

          <div className="question">
            <label>Sex</label>
            <select value={answers.sex} onChange={(e) => handleChangeField('sex', e.target.value)}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="question">
            <label>Strengths</label>
            <div className="options">
              {['Consistency','Experience','Flexibility'].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={answers.strengths.includes(s) ? 'option selected' : 'option'}
                  onClick={() => toggleArrayField('strengths', s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="question">
            <label>Weaknesses</label>
            <div className="options">
              {['Injury','Time','Motivation'].map((w) => (
                <button
                  key={w}
                  type="button"
                  className={answers.weaknesses.includes(w) ? 'option selected' : 'option'}
                  onClick={() => toggleArrayField('weaknesses', w)}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

                <div className="recommendation-actions">
                  <button type="button" className="get-recommendation" onClick={computeRecommendationForButton}>
                    Get Recommendation
                  </button>

                  {validationError && (
                    <div className="validation-error">{validationError}</div>
                  )}

                  {recommendation && recommendation.recommended && (
                    <div className="recommendation-card-wrap">
                      <article className="membership-card highlight">
                        <div className="recommended-badge">Recommended</div>

                        <div className="membership-card-top">
                          <h2>{recommendation.recommended.name}</h2>
                          <h3>{recommendation.recommended.price}</h3>
                        </div>

                        <p className="membership-description">
                          {recommendation.recommended.description}
                        </p>

                        <div className="membership-divider"></div>

                        <h4>What's Included</h4>

                        <ul className="membership-benefits">
                          {(Array.isArray(recommendation.recommended.benefits) ? recommendation.recommended.benefits : []).map((benefit, index) => (
                            <li key={index}>
                              <span className="membership-check">✓</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>

                        <div className="rec-actions">
                          <button
                            type="button"
                            className="membership-button"
                            onClick={() => handleSelectMembership(recommendation.recommended)}
                          >
                            Register Today
                          </button>

                          <button
                            type="button"
                            className="link-button"
                            onClick={() => setRecommendation(null)}
                          >
                            Close
                          </button>
                        </div>
                      </article>
                    </div>
                  )}
                </div>
            </>
          )}
        </section>

      </section>
    </main>
  );
}