import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ token, username, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        {/* Hamburger Menu */}
        <button
          className="hamburger-button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>

        {/* FitnessTech Logo */}
        <Link to="/" className="navbar-logo">
          FITNESS<span>TECH</span>
        </Link>

        {/* Join Now / User */}
        {!token ? (
          <Link to="/register" className="join-now-button">
            JOIN NOW
          </Link>
        ) : (
          <div className="navbar-user">
            <span>{username}</span>

            <button onClick={onLogout} className="logout-button">
              LOGOUT
            </button>
          </div>
        )}
      </header>

      {/* Dark background when menu is open */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Hamburger Side Menu */}
      <nav className={`side-menu ${menuOpen ? "open" : ""}`}>
        <div className="side-menu-header">
          <div className="side-menu-logo">
            FITNESS<span>TECH</span>
          </div>

          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="side-menu-links">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            HOME
          </Link>

          <Link to="/workout-videos" onClick={() => setMenuOpen(false)}>
            WORKOUT VIDEOS
          </Link>

          <Link to="/workout-tracker" onClick={() => setMenuOpen(false)}>
            WORKOUT TRACKER
          </Link>

          <Link to="/memberships" onClick={() => setMenuOpen(false)}>
            MEMBERSHIPS
          </Link>

          <Link to="/about" onClick={() => setMenuOpen(false)}>
            ABOUT US
          </Link>

          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            CONTACT US
          </Link>

          {!token && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                LOGIN
              </Link>

              <Link to="/register" onClick={() => setMenuOpen(false)}>
                REGISTER
              </Link>
            </>
          )}

          {token && (
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              PROFILE
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;