

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-container">

        <div className="about-header">
          <p className="about-kicker">
            ABOUT • FITNESS • TECH
          </p>

          <h1 className="about-title">
            ABOUT FITNESS<span>TECH</span>
          </h1>

          <p className="about-description">
            Fitness<span className="green-text">Tech</span> is a full-stack
            fitness website that allows users to create an account, log in
            securely, view membership tiers, browse products, and manage
            their profile.
          </p>
        </div>

        <section className="technology-section">
          <h2>
            TECHNOLOGIES <span>USED</span>
          </h2>

          <div className="technology-grid">

            <div className="technology-card">
              <div className="technology-number">01</div>
              <h3>React + Vite</h3>
              <p>Frontend</p>
            </div>

            <div className="technology-card">
              <div className="technology-number">02</div>
              <h3>Express.js</h3>
              <p>Backend</p>
            </div>

            <div className="technology-card">
              <div className="technology-number">03</div>
              <h3>MongoDB + Mongoose</h3>
              <p>Database</p>
            </div>

            <div className="technology-card">
              <div className="technology-number">04</div>
              <h3>JWT Authentication</h3>
              <p>Authentication</p>
            </div>

            <div className="technology-card">
              <div className="technology-number">05</div>
              <h3>Bcrypt</h3>
              <p>Password Hashing</p>
            </div>

          </div>
        </section>

      </section>
    </main>
  );
}