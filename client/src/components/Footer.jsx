import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-label">Info</div>
          <Link to="/about" className="footer-button">
            About
          </Link>
          <Link to="/contact" className="footer-button">
            Contact
          </Link>
        </div>

        <div className="footer-right">
          <div className="footer-label">Account</div>
          <Link to="/login" className="footer-button">
            Login
          </Link>
          <Link to="/register" className="footer-button">
            Register
          </Link>
        </div>
      </div>

      <p>© 2026 Fitness Tech</p>
    </footer>
  );
}

export default Footer;