import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ParticleBackground from '../components/ParticleBackground';
import './Landing.css';

export default function Landing() {
  return (
    <>
      <ParticleBackground />
      <Header />

      <main className="landing">
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Discover. Organize.<br />
                <span className="gradient-text">Experience Campus Events.</span>
              </h1>
              <p className="hero-subtitle">
                The ultimate platform for students and organizers to create, discover, and attend amazing campus events.
                Track attendance with QR codes and manage everything in real-time.
              </p>
              <div className="hero-cta">
                <Link to="/events" className="btn btn-primary">
                  Explore Events
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Create Event
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2 className="section-title">Why Choose CampusEvents?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Discover Events</h3>
                <p>Find campus events tailored to your interests. Filter by category, date, and college.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>QR Code Attendance</h3>
                <p>Mark attendance instantly with QR code scanning. No more manual roll calls.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Real-Time Analytics</h3>
                <p>Track participant counts, attendance rates, and engagement metrics live.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🎪</div>
                <h3>Easy Event Creation</h3>
                <p>Create and manage events effortlessly. Invite participants and track registrations.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🔔</div>
                <h3>Smart Notifications</h3>
                <p>Get notified about upcoming events, registration confirmations, and updates.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🏆</div>
                <h3>Engagement Tracking</h3>
                <p>View your attendance history and participation stats across all events.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <h2>Ready to Transform Your Campus Events?</h2>
              <p>Join thousands of students and organizers already using CampusEvents</p>
              <Link to="/register" className="btn btn-primary">
                Get Started Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 CampusEvents. Built with precision for the future.</p>
        </div>
      </footer>
    </>
  );
}
