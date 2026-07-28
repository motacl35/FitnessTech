import { useState } from "react";

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
    <main className="page">
      <section className="card">
        <h1>Workout Videos</h1>
        <p>Select a body part to view a workout video.</p>

        <select value={bodyPart} onChange={(e) => setBodyPart(e.target.value)}>
          <option value="">Choose Body Part</option>
          <option value="arms">Arms</option>
          <option value="legs">Legs</option>
          <option value="back">Back</option>
          <option value="chest">Chest</option>
          <option value="shoulders">Shoulders</option>
          <option value="core">Core</option>
        </select>

        {bodyPart && (
          <div className="video-container">
            <iframe
              src={videos[bodyPart]}
              title={`${bodyPart} exercise video`}
              allowFullScreen
            ></iframe>
          </div>
        )}
      </section>
    </main>
  );
}