import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ token, username, onLogout }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogoutClick() {
    onLogout();
    closeMenu();
  }

  function navLink(path, label) {
    if (location.pathname === path) return null;

    return (
      <Link to={path} onClick={closeMenu}>
        {label}
      </Link>
    );
  }

  return (
    <>
      <nav className="navbar">
        <button
          type="button"
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <h2 className="navbar-logo">Fitness Tech</h2>

        <div className="navbar-user">
          {token ? (
            <>
            <span>Welcome, {username}</span>

            <button type="button" onClick={handleLogoutClick}>
              Logout
            </button>
            </>
            ) : (
              <Link to="/register" className="join-now-button">
                Join Now
              </Link>
            )}
          </div>
       </nav>

      {menuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}

      <aside className={`side-menu ${menuOpen ? "show" : ""}`}>
        <div className="side-menu-header">
          <h2>Fitness Tech</h2>

          <button type="button" className="close-menu" onClick={closeMenu}>
            ×
          </button>
        </div>

        <div className="side-menu-links">
          {navLink("/", "Home")}

          {!token && navLink("/memberships", "Memberships")}

          {token && navLink("/profile", "Profile")}

          {navLink("/workout-videos", "Workout Videos")}
          {navLink("/workout-tracker", "Workout Tracker")}
          {navLink("/about", "About")}
          {navLink("/contact", "Contact")}

          {!token ? (
            <>
              {navLink("/login", "Login")}
              {navLink("/register", "Register")}
            </>
          ) : (
            <button type="button" className="side-logout" onClick={handleLogoutClick}>
              Logout
            </button>
          )}
        </div>
      </aside>
    </>
  );
}