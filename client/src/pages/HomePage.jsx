
import { Link } from "react-router-dom";
import "./Homepage.css";

export default function HomePage() {
  return (
    <main className="home-page">

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">

          <p className="hero-kicker">
            LEARN • TRAIN • IMPROVE
          </p>

          <h1 className="hero-title">
            WELCOME TO
            <span>FITNESS TECH</span>
          </h1>

          <p className="hero-description">
            Learn proper exercise form with step-by-step instructions,
            workout videos, pictures, and training tools designed to help
            you train safely and reach your goals.
          </p>

          <div className="hero-buttons">

            <Link
              to="/workout-videos"
              className="primary-button"
            >
              EXPLORE WORKOUTS
            </Link>

            <Link
              to="/workout-tracker"
              className="secondary-button"
            >
              TRACK A WORKOUT
            </Link>

          </div>
        </div>
      </section>


      {/* FEATURE SECTION */}
      <section className="feature-section">

        {/* FEATURE 1 */}
        <div className="feature-card">

          <div className="feature-icon">
            🏋️
          </div>

          <div>
            <h2>LEARN PROPER FORM</h2>

            <p>
              Follow clear instructions with pictures and videos to
              perform exercises correctly and safely.
            </p>
          </div>

        </div>


        {/* FEATURE 2 */}
        <div className="feature-card">

          <div className="feature-icon">
            🔎
          </div>

          <div>
            <h2>FIND WORKOUTS</h2>

            <p>
              Browse exercises by muscle group and discover workouts
              that match your goals.
            </p>
          </div>

        </div>


        {/* FEATURE 3 */}
        <div className="feature-card">

          <div className="feature-icon">
            📈
          </div>

          <div>
            <h2>TRACK PROGRESS</h2>

            <p>
              Save your workouts, sets, repetitions, and weight so you
              can monitor your progress.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}