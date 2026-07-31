import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Logo.png";

export default function Navbar({ token, username, onLogout }) {
  /* Current Page Location */
  const location = useLocation();

  /* Side Menu State */
  const [menuOpen, setMenuOpen] = useState(false);

  /* Close Side Menu */
  function closeMenu() {
    setMenuOpen(false);
  }

  /* Handle Logout */
  function handleLogoutClick() {
    onLogout();
    closeMenu();
  }

  /* Display Navigation Link */
  function navLink(path, label) {
    if (location.pathname === path) {
      return null;
    }

    return (
      <Link to={path} onClick={closeMenu}>
        {label}
      </Link>
    );
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        {/* Hamburger Button */}
        <button
          type="button"
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navbar Logo */}
        <h2 className="navbar-logo">
          Fitness<span className="tech-green">Tech</span>
        </h2>

        {/* Navbar User Section */}
        <div className="navbar-user">
          {token ? (
            <>
              {/* Welcome Message */}
              <span>Welcome, {username}</span>

              {/* Logout Button */}
              <button type="button" onClick={handleLogoutClick}>
                Logout
              </button>
            </>
          ) : (
            /* Join Now Button */
            <Link
              to="/register"
              className="join-now-button"
              onClick={closeMenu}
            >
              Join Now
            </Link>
          )}
        </div>
      </nav>

      {/* Menu Overlay */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        ></div>
      )}

      {/* Side Menu */}
      <aside className={`side-menu ${menuOpen ? "show" : ""}`}>
        {/* Side Menu Header */}
        <div className="side-menu-header">
          {/* Side Menu Logo */}
          <h2>
            Fitness <span className="tech-green">Tech</span>
          </h2>

          {/* Close Menu Button */}
          <button
            type="button"
            className="close-menu"
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >
            ×
          </button>
        </div>

        {/* Side Menu Links */}
        <div className="side-menu-links">
          {/* Home Link */}
          {navLink("/", "Home")}

          {/* Memberships Link */}
          {!token && navLink("/memberships", "Memberships")}

          {/* Profile Link */}
          {token && navLink("/profile", "Profile")}

          {/* Workout Videos Link */}
          {navLink("/workout-videos", "Workout Videos")}

          {/* Workout Tracker Link */}
          {navLink("/workout-tracker", "Workout Tracker")}

          {/* About Link */}
          {navLink("/about", "About")}

          {/* Contact Link */}
          {navLink("/contact", "Contact")}

          {/* Login and Register Links */}
          {!token ? (
            <>
              {navLink("/login", "Login")}
              {navLink("/register", "Register")}
            </>
          ) : (
            /* Side Menu Logout Button */
            <button
              type="button"
              className="side-logout"
              onClick={handleLogoutClick}
            >
              Logout
            </button>
          )}
        </div>
      </aside>
    </>
  );
}