import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService, Event } from '../../../services/event.service';
import { AttendanceService } from '../../../services/attendance.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { ParticleBackgroundComponent } from '../../../components/particle-background/particle-background.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, ParticleBackgroundComponent],
  template: `
    <app-particle-background></app-particle-background>
    <app-header></app-header>

    <div class="dashboard-page">
      <div class="container">
        <div class="page-header">
          <h1>My Dashboard</h1>
          <p>Track your events and attendance</p>
        </div>

        <div class="stats-overview">
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <div class="stat-value">{{myEvents.length}}</div>
              <div class="stat-label">Registered Events</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <div class="stat-value">{{attendanceHistory.length}}</div>
              <div class="stat-label">Events Attended</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <div class="stat-value">{{calculateAttendanceRate()}}%</div>
              <div class="stat-label">Attendance Rate</div>
            </div>
          </div>
        </div>

        <div class="dashboard-section">
          <div class="section-header">
            <h2>My Registered Events</h2>
            <a routerLink="/events" class="btn-secondary">Discover More</a>
          </div>

          <div *ngIf="loadingEvents" class="loading">
            <div class="spinner"></div>
          </div>

          <div *ngIf="!loadingEvents && myEvents.length === 0" class="empty-state">
            <div class="empty-icon">📅</div>
            <h3>No Events Yet</h3>
            <p>Start by discovering and joining events</p>
            <a routerLink="/events" class="btn-primary">Explore Events</a>
          </div>

          <div *ngIf="!loadingEvents && myEvents.length > 0" class="events-grid">
            <div *ngFor="let event of myEvents" class="event-card">
              <div class="event-header">
                <div class="event-category">{{event.category}}</div>
                <div class="participant-status" [class]="'status-' + event.participantStatus?.toLowerCase()">
                  {{event.participantStatus}}
                </div>
              </div>

              <h3 class="event-title">{{event.title}}</h3>

              <div class="event-meta">
                <div class="meta-item">
                  <span>📅</span>
                  <span>{{formatDate(event.date)}}</span>
                </div>
                <div class="meta-item">
                  <span>⏰</span>
                  <span>{{event.startTime}}</span>
                </div>
                <div class="meta-item">
                  <span>📍</span>
                  <span>{{event.location}}</span>
                </div>
              </div>

              <a [routerLink]="['/events', event._id]" class="btn-view">View Details</a>
            </div>
          </div>
        </div>

        <div class="dashboard-section">
          <div class="section-header">
            <h2>Attendance History</h2>
          </div>

          <div *ngIf="loadingAttendance" class="loading">
            <div class="spinner"></div>
          </div>

          <div *ngIf="!loadingAttendance && attendanceHistory.length === 0" class="empty-state">
            <div class="empty-icon">✅</div>
            <h3>No Attendance Records</h3>
            <p>Attend events to build your history</p>
          </div>

          <div *ngIf="!loadingAttendance && attendanceHistory.length > 0" class="attendance-list">
            <div *ngFor="let attendance of attendanceHistory" class="attendance-item">
              <div class="attendance-icon">✅</div>
              <div class="attendance-details">
                <div class="attendance-event">{{attendance.event?.title}}</div>
                <div class="attendance-meta">
                  <span>{{formatDate(attendance.event?.date)}}</span>
                  <span>•</span>
                  <span>Marked at {{formatTime(attendance.markedAt)}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      min-height: 100vh;
      padding: 2rem 0 4rem;
      position: relative;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .page-header {
      margin-bottom: 3rem;
      padding-top: 2rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .page-header p {
      font-size: 1.1rem;
      color: var(--text-secondary);
    }

    .stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 4rem;
    }

    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: all 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-3px);
      border-color: var(--gold);
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
    }

    .stat-icon {
      font-size: 3rem;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--gold);
      line-height: 1;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .dashboard-section {
      margin-bottom: 4rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .section-header h2 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .btn-secondary {
      background: transparent;
      border: 1px solid var(--gold);
      color: var(--gold);
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: var(--gold);
      color: #0B0B0B;
    }

    .loading {
      text-align: center;
      padding: 3rem 0;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--border-color);
      border-top-color: var(--gold);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--gold), #B8941E);
      color: #0B0B0B;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      display: inline-block;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
    }

    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .event-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s;
    }

    .event-card:hover {
      transform: translateY(-3px);
      border-color: var(--gold);
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
    }

    .event-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .event-category {
      background: rgba(212, 175, 55, 0.1);
      color: var(--gold);
      padding: 0.375rem 0.875rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .participant-status {
      padding: 0.375rem 0.875rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-registered {
      background: rgba(59, 130, 246, 0.1);
      color: #3B82F6;
    }

    .status-attended {
      background: rgba(34, 197, 94, 0.1);
      color: #22C55E;
    }

    .event-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .event-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .btn-view {
      display: block;
      text-align: center;
      background: linear-gradient(135deg, var(--gold), #B8941E);
      color: #0B0B0B;
      padding: 0.625rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-view:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
    }

    .attendance-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .attendance-item {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .attendance-icon {
      font-size: 2rem;
      color: #22C55E;
    }

    .attendance-event {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .attendance-meta {
      display: flex;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .stats-overview {
        grid-template-columns: 1fr;
      }

      .events-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  myEvents: any[] = [];
  attendanceHistory: any[] = [];
  loadingEvents = false;
  loadingAttendance = false;

  constructor(
    private eventService: EventService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit() {
    this.loadMyEvents();
    this.loadAttendanceHistory();
  }

  loadMyEvents() {
    this.loadingEvents = true;
    this.eventService.getMyEvents().subscribe({
      next: (events) => {
        this.myEvents = events;
        this.loadingEvents = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.loadingEvents = false;
      }
    });
  }

  loadAttendanceHistory() {
    this.loadingAttendance = true;
    this.attendanceService.getUserAttendanceHistory().subscribe({
      next: (history) => {
        this.attendanceHistory = history;
        this.loadingAttendance = false;
      },
      error: (err) => {
        console.error('Error loading attendance:', err);
        this.loadingAttendance = false;
      }
    });
  }

  calculateAttendanceRate(): number {
    if (this.myEvents.length === 0) return 0;
    return Math.round((this.attendanceHistory.length / this.myEvents.length) * 100);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
