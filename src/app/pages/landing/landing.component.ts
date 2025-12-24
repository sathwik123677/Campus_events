import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ParticleBackgroundComponent } from '../../components/particle-background/particle-background.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, ParticleBackgroundComponent, HeaderComponent],
  template: `
    <app-particle-background></app-particle-background>
    <app-header></app-header>

    <main class="landing">
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">
              Discover. Organize.<br>
              <span class="gradient-text">Experience Campus Events.</span>
            </h1>
            <p class="hero-subtitle">
              The ultimate platform for students and organizers to create, discover, and attend amazing campus events.
              Track attendance with QR codes and manage everything in real-time.
            </p>
            <div class="hero-cta">
              <a routerLink="/events" class="btn btn-primary">
                Explore Events
              </a>
              <a routerLink="/register" class="btn btn-secondary">
                Create Event
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="features">
        <div class="container">
          <h2 class="section-title">Why Choose CampusEvents?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🎯</div>
              <h3>Discover Events</h3>
              <p>Find campus events tailored to your interests. Filter by category, date, and college.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>QR Code Attendance</h3>
              <p>Mark attendance instantly with QR code scanning. No more manual roll calls.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3>Real-Time Analytics</h3>
              <p>Track participant counts, attendance rates, and engagement metrics live.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🎪</div>
              <h3>Easy Event Creation</h3>
              <p>Create and manage events effortlessly. Invite participants and track registrations.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🔔</div>
              <h3>Smart Notifications</h3>
              <p>Get notified about upcoming events, registration confirmations, and updates.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🏆</div>
              <h3>Engagement Tracking</h3>
              <p>View your attendance history and participation stats across all events.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="cta-section">
        <div class="container">
          <div class="cta-card">
            <h2>Ready to Transform Your Campus Events?</h2>
            <p>Join thousands of students and organizers already using CampusEvents</p>
            <a routerLink="/register" class="btn btn-primary">
              Get Started Free
            </a>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 CampusEvents. Built with precision for the future.</p>
      </div>
    </footer>
  `,
  styles: [`
    .landing {
      position: relative;
      min-height: 100vh;
    }

    .hero {
      min-height: 90vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 4rem 2rem;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .hero-content {
      max-width: 900px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: 4rem;
      font-weight: 800;
      line-height: 1.2;
      color: var(--text-primary);
      margin-bottom: 1.5rem;
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--gold), #EDEDED);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      line-height: 1.8;
      color: var(--text-secondary);
      margin-bottom: 3rem;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-cta {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 1rem 2.5rem;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.3s;
      display: inline-block;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--gold), #B8941E);
      color: #0B0B0B;
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(212, 175, 55, 0.4);
    }

    .btn-secondary {
      background: var(--card-bg);
      color: var(--gold);
      border: 2px solid var(--gold);
    }

    .btn-secondary:hover {
      background: var(--gold);
      color: #0B0B0B;
      transform: translateY(-3px);
    }

    .features {
      padding: 8rem 2rem;
      background: var(--section-bg);
    }

    .section-title {
      font-size: 3rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 4rem;
      color: var(--text-primary);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 2.5rem;
      text-align: center;
      transition: all 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      border-color: var(--gold);
      box-shadow: 0 20px 40px rgba(212, 175, 55, 0.2);
    }

    .feature-icon {
      font-size: 3.5rem;
      margin-bottom: 1.5rem;
    }

    .feature-card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .feature-card p {
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .cta-section {
      padding: 6rem 2rem;
    }

    .cta-card {
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(237, 237, 237, 0.05));
      border: 2px solid var(--gold);
      border-radius: 20px;
      padding: 4rem 2rem;
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .cta-card h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .cta-card p {
      font-size: 1.2rem;
      color: var(--text-secondary);
      margin-bottom: 2.5rem;
    }

    .footer {
      background: var(--card-bg);
      border-top: 1px solid var(--border-color);
      padding: 2rem;
      text-align: center;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.1rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .cta-card h2 {
        font-size: 2rem;
      }
    }
  `]
})
export class LandingComponent {}
