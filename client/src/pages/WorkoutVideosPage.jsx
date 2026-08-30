import { useState } from "react";

const videos = {
  arms: "https://www.youtube.com/embed/ykJmrZ5v0Oo",
  legs: "https://www.youtube.com/embed/aclHkVaku9U",
  back: "https://www.youtube.com/embed/eGo4IYlbE5g",
  chest: "https://www.youtube.com/embed/rT7DgCr-3pg",
  shoulders: "https://www.youtube.com/embed/qEwKCR5JCog",
  core: "https://www.youtube.com/embed/1919eTCoESo",
  glutes: "https://www.youtube.com/embed/HzRwKt2NLQ8",
};

const trainingGuidance = {
  arms: {
    title: "Arm Training Guidance",
    description:
      "Arm workouts focus on the biceps and triceps while also engaging the shoulders and forearms.",
    tips: [
      "Use controlled movements instead of swinging the weight.",
      "Keep your elbows stable during curls and extensions.",
      "Choose a weight that allows you to maintain proper form.",
      "Use a full and comfortable range of motion.",
    ],
  },

  legs: {
    title: "Leg Training Guidance",
    description:
      "Leg training builds strength in the quadriceps, hamstrings, glutes, and calves while improving lower-body stability.",
    tips: [
      "Keep your knees aligned with your toes.",
      "Maintain a strong and stable core.",
      "Control both the lowering and lifting portions of each repetition.",
      "Increase resistance gradually.",
    ],
  },

  back: {
    title: "Back Training Guidance",
    description:
      "Back exercises help strengthen the upper and lower back while supporting posture and upper-body stability.",
    tips: [
      "Keep your spine in a neutral position.",
      "Pull with your back muscles instead of relying only on your arms.",
      "Avoid using momentum.",
      "Focus on squeezing your shoulder blades together.",
    ],
  },

  chest: {
    title: "Chest Training Guidance",
    description:
      "Chest exercises primarily target the pectoral muscles while also engaging the shoulders and triceps.",
    tips: [
      "Keep your shoulder blades stable.",
      "Lower the weight slowly and maintain control.",
      "Avoid excessively flaring your elbows.",
      "Use a comfortable range of motion.",
    ],
  },

  shoulders: {
    title: "Shoulder Training Guidance",
    description:
      "Shoulder workouts strengthen the deltoid muscles and improve upper-body stability.",
    tips: [
      "Avoid using excessive weight.",
      "Keep your core engaged during overhead movements.",
      "Move slowly and under control.",
      "Avoid shrugging during raises.",
    ],
  },

  core: {
    title: "Core Training Guidance",
    description:
      "Core exercises strengthen the abdominal muscles and other stabilizers that support posture, balance, and movement.",
    tips: [
      "Keep your core engaged throughout each exercise.",
      "Avoid pulling on your neck.",
      "Use slow and controlled repetitions.",
      "Maintain steady breathing.",
    ],
  },

  glutes: {
    title: "Glute Training Guidance",
    description:
      "Glute training targets the gluteus maximus, medius, and minimus while supporting hip strength and lower-body stability.",
    tips: [
      "Drive through your heels during hip-focused movements.",
      "Squeeze your glutes at the top of each repetition.",
      "Keep your core engaged.",
      "Avoid excessively arching your lower back.",
    ],
  },
};

const tips = {
  arms: [
    "Keep elbows tucked and control the eccentric phase.",
    "Avoid swinging; use strict form for biceps curls.",
    "Warm up with light sets and stretch wrists.",
  ],

  legs: [
    "Push through heels on squats to activate glutes.",
    "Keep knees tracking over toes and avoid letting them cave in.",
    "Use a full range of motion but don't lock knees forcefully.",
  ],

  back: [
    "Maintain a neutral spine; hinge at the hips for deadlifts.",
    "Avoid rounding the lower back under load.",
    "Engage lats before pulling for better control.",
  ],

  chest: [
    "Retract shoulder blades and lower under control.",
    "Avoid flaring elbows excessively on pressing movements.",
  ],

  shoulders: [
    "Use controlled motion; avoid using momentum for raises.",
    "Keep a slight bend in the elbow to protect the joint.",
  ],

  core: [
    "Breathe and brace the midline; avoid holding breath.",
    "Focus on slow, controlled reps rather than speed.",
  ],

  glutes: [
    "Drive through your heels during hip-focused movements.",
    "Squeeze your glutes at the top of each repetition.",
    "Keep your core engaged throughout the movement.",
    "Avoid excessively arching your lower back.",
  ],
};

export default function ExerciseVideosPage() {
  const [bodyPart, setBodyPart] = useState("");

  return (
    <main className="videos-page">
      <section className="videos-card">
        <p className="videos-kicker">TRAIN • LEARN • IMPROVE</p>

        <h1 className="videos-title">
          WORKOUT <span>VIDEOS</span>
        </h1>

        <p className="videos-description">
          Select a body part to view a workout video.
        </p>

        <div className="videos-controls">
          <label htmlFor="bodyPart">Choose Body Part</label>

          <select
            id="bodyPart"
            value={bodyPart}
            onChange={(e) => setBodyPart(e.target.value)}
          >
            <option value="">Choose Body Part</option>
            <option value="arms">Arms</option>
            <option value="legs">Legs</option>
            <option value="back">Back</option>
            <option value="chest">Chest</option>
            <option value="shoulders">Shoulders</option>
            <option value="core">Core</option>
            <option value="glutes">Glutes</option>
          </select>
        </div>

        {bodyPart && (
          <>
            <div className="video-section">
              <div className="video-column video-media">
                <div className="video-heading-row">
                  <h2 className="ft-page-title">{bodyPart} workout</h2>

                  <span className="video-badge">{bodyPart}</span>
                </div>

                <div className="video-container">
                  <iframe
                    src={videos[bodyPart]}
                    title={`${bodyPart} exercise video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              <aside className="video-column video-tips">
                <h3>Tips & Safety</h3>

                <ul>
                  {tips[bodyPart].map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>

                <div className="video-technique">
                  <h4>Form & Technique</h4>

                  <p>
                    Focus on controlled movement, proper breathing, and
                    maintaining a neutral spine. Start light, prioritize
                    technique, and progress slowly.
                  </p>
                </div>

                <div className="video-disclaimer">
                  <strong>Disclaimer:</strong> FitnessTech is not responsible
                  for injuries incurred while following these workouts.
                  Consult a physician before beginning any exercise program.
                </div>
              </aside>
            </div>

            <div className="training-guidance">
              <h3>{trainingGuidance[bodyPart].title}</h3>

              <p>{trainingGuidance[bodyPart].description}</p>

              <h4>Training Tips</h4>

              <ul>
                {trainingGuidance[bodyPart].tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </section>
    </main>
  );
}