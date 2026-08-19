import { useState } from "react";
import "./WorkoutVideosPage.css";

const videos = {
  arms: "https://www.youtube.com/embed/ykJmrZ5v0Oo",
  legs: "https://www.youtube.com/embed/aclHkVaku9U",
  back: "https://www.youtube.com/embed/eGo4IYlbE5g",
  chest: "https://www.youtube.com/embed/rT7DgCr-3pg",
  shoulders: "https://www.youtube.com/embed/qEwKCR5JCog",
  core: "https://www.youtube.com/embed/1919eTCoESo",
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
            <div className="video-heading-row">
              <h2>{bodyPart} workout</h2>

              <span className="video-badge">
                {bodyPart}
              </span>
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
        )}
      </section>
    </main>
  );
}
