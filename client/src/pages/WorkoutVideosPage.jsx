import { useState } from "react";


const videos = {
  arms: "https://www.youtube.com/embed/ykJmrZ5v0Oo",
  legs: "https://www.youtube.com/embed/aclHkVaku9U",
  back: "https://www.youtube.com/embed/eGo4IYlbE5g",
  chest: "https://www.youtube.com/embed/rT7DgCr-3pg",
  shoulders: "https://www.youtube.com/embed/qEwKCR5JCog",
  core: "https://www.youtube.com/embed/1919eTCoESo",
};

const tips = {
  arms: [
    "Keep elbows tucked and control the eccentric phase.",
    "Avoid swinging; use strict form for biceps curls.",
    "Warm up with light sets and stretch wrists."],
  legs: [
    "Push through heels on squats to activate glutes.",
    "Keep knees tracking over toes and avoid letting them cave in.",
    "Use a full range of motion but don't lock knees forcefully."],
  back: [
    "Maintain a neutral spine; hinge at the hips for deadlifts.",
    "Avoid rounding the lower back under load.",
    "Engage lats before pulling for better control."],
  chest: [
    "Retract shoulder blades and lower under control.",
    "Avoid flaring elbows excessively on pressing movements."],
  shoulders: [
    "Use controlled motion; avoid using momentum for raises.",
    "Keep a slight bend in the elbow to protect the joint."],
  core: [
    "Breathe and brace the midline; avoid holding breath.",
    "Focus on slow, controlled reps rather than speed."]
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
          </select>
        </div>

        {bodyPart && (
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
                {tips[bodyPart].map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>

              <div className="video-technique">
                <h4>Form & Technique</h4>
                <p>
                  Focus on controlled movement, proper breathing, and maintaining a neutral spine.
                  Start light, prioritize technique, and progress slowly.
                </p>
              </div>

              <div className="video-disclaimer">
                <strong>Disclaimer:</strong> FitnessTech is not responsible for injuries incurred
                while following these workouts. Consult a physician before beginning any
                exercise program.
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
