export default function AboutPage() {
  return (
    <main className="page">
      {/* Page Heading */}
      <h1>
        About Fitness<span className="tech-green">Tech</span>
      </h1>

      {/* About FitnessTech */}
      <p>
        Fitness<span className="tech-green">Tech</span> is a full-stack fitness
        website that allows users to create an account, log in securely, view
        membership tiers, browse products, and manage their profile.
      </p>

      {/* Technologies Heading */}
      <h2>Technologies Used</h2>

      {/* Technology List */}
      <ul>
        <li>React with Vite</li>
        <li>Express.js</li>
        <li>MongoDB with Mongoose</li>
        <li>JWT Authentication</li>
        <li>Bcrypt Password Hashing</li>
      </ul>
    </main>
  );
}