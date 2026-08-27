import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FitnessAI from "./components/FitnessAI";

import HomePage from "./pages/Homepage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import MembershipsPage from "./pages/MembershipsPage";
import WorkoutVideosPage from "./pages/WorkoutVideosPage";
import WorkoutTrackerPage from "./pages/WorkoutTrackerPage";

function App() {
  const [token, setToken] = useState(sessionStorage.getItem("jwt") || null);
  const [username, setUsername] = useState(
    sessionStorage.getItem("username") || ""
  );

  function handleLogin(newToken, newUsername) {
    sessionStorage.setItem("jwt", newToken);
    sessionStorage.setItem("username", newUsername);

    setToken(newToken);
    setUsername(newUsername);
  }

  function handleLogout() {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("username");

    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    localStorage.removeItem("currentUser");

    setToken(null);
    setUsername("");
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar token={token} username={username} onLogout={handleLogout} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage token={token} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/memberships" element={<MembershipsPage />} />
            <Route path="/workout-videos" element={<WorkoutVideosPage />} />
            <Route path="/workout-tracker" element={<WorkoutTrackerPage token={token} />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage onLogin={handleLogin} />}/>
            <Route path="/profile" element={<ProfilePage token={token} />} />
          </Routes>
        </main>

        <Footer />
        {/* Persistent Fitness AI */}
    <FitnessAI token={token} />

      </div>
    </BrowserRouter>
  );
}

export default App;