import React from "react";
import { Link } from "react-router-dom";
import "../../styles/landing.css";

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <h1>🍽️ FoodFlix</h1>
          </div>
          <div className="nav-links">
            <Link to="/user/login" className="nav-link login-link">
              Login
            </Link>
            <Link to="/user/register" className="nav-link register-link">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-visual">
          <div className="hero-emoji">🎬</div>
        </div>
        <div className="hero-content">
          <h2 className="hero-title">Discover Food Videos</h2>
          <p className="hero-subtitle">
            Watch delicious food content, like your favorites, and explore amazing restaurants
          </p>
          <div className="hero-buttons">
            <Link to="/feed" className="btn btn-primary">
              Start Exploring
            </Link>
            <Link to="/user/register" className="btn btn-secondary">
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2>Why Choose FoodFlix?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👀</div>
              <h3>Browse</h3>
              <p>Scroll endless food videos</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❤️</div>
              <h3>Like</h3>
              <p>Save your favorites</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏪</div>
              <h3>Visit</h3>
              <p>Explore restaurants</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Explore?</h2>
        <p>Browse videos now, or create an account to like and save</p>
        <Link to="/feed" className="btn btn-primary-large">
          View Videos
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2024 FoodFlix</p>
        <div className="footer-links">
          <Link to="/food-partner/login">For Partners</Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
