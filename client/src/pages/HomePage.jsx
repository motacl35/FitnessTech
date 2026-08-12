import "./Homepage.css";

function HomePage() {
  return (
    <div className="fitness-home">

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-container">

          <div className="hero-text">
            <p className="small-title">
              LEARN • TRAIN • IMPROVE
            </p>

            <h1>
              WELCOME TO
              <span>FITNESS TECH</span>
            </h1>

            <p className="hero-description">
              Learn proper exercise form with step-by-step instructions,
              workout videos, pictures, and training tools designed to
              help you train safely and reach your goals.
            </p>

            <div className="hero-buttons">
              <a href="/workout-videos" className="explore-button">
                Explore Workouts
              </a>

              <a href="/workout-tracker" className="tracker-button">
                Track A Workout
              </a>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="hero-image">
            <div className="image-accent"></div>
          </div>

        </div>
      </section>


      {/* FEATURES SECTION */}
      <section className="features-section">

        <div className="feature">
          <div className="feature-icon">
            🏋
          </div>

          <div>
            <h3>Learn Proper Form</h3>

            <p>
              Follow clear instructions with pictures and videos
              to perform exercises correctly and safely.
            </p>
          </div>
        </div>


        <div className="feature">
          <div className="feature-icon">
            🔎
          </div>

          <div>
            <h3>Find Workouts</h3>

            <p>
              Browse exercises by muscle group and discover
              workouts that match your goals.
            </p>
          </div>
        </div>


        <div className="feature">
          <div className="feature-icon">
            📈
          </div>

          <div>
            <h3>Track Progress</h3>

            <p>
              Save your workouts, sets, repetitions, and weight
              so you can monitor your progress.
            </p>
          </div>
        </div>

      </section>


      {/* MUSCLE GROUP SECTION */}
      <section className="muscle-section">

        <p className="small-title">
          BROWSE BY MUSCLE GROUP
        </p>

        <h2>
          Choose A Category
        </h2>

        <div className="muscle-grid">

          <a href="/workout-videos" className="muscle-card">
            <span>💪</span>
            Chest
          </a>

          <a href="/workout-videos" className="muscle-card">
            <span>🏋</span>
            Back
          </a>

          <a href="/workout-videos" className="muscle-card">
            <span>🦵</span>
            Legs
          </a>

          <a href="/workout-videos" className="muscle-card">
            <span>💪</span>
            Arms
          </a>

          <a href="/workout-videos" className="muscle-card">
            <span>🏋</span>
            Shoulders
          </a>

        </div>
      </section>

    </div>
  );
}

export default HomePage;