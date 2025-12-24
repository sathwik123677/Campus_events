import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { ParticleBackgroundComponent } from '../../../components/particle-background/particle-background.component';

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, ParticleBackgroundComponent],
  template: `
    <app-particle-background></app-particle-background>
    <app-header></app-header>

    <div class="dashboard-page">
      <div class="container">
        <div class="page-header">
          <div>
            <h1>Organizer Dashboard</h1>
            <p>Manage your events and track performance</p>
          </div>
          <a routerLink="/events/create" class="btn-create">+ Create Event</a>
        </div>

        <div class="stats-overview">
          <div class="stat-card">
            <div class="stat-icon">🎪</div>
            <div class="stat-content">
              <div class="stat-value">{{organizedEvents.length}}</div>
              <div class="stat-label">Total Events</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <div class="stat-value">{{getTotalParticipants()}}</div>
              <div class="stat-label">Total Participants</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <div class="stat-value">{{getTotalAttendance()}}</div>
              <div class="stat-label">Total Attendance</div>
            </div>
          </div>
        </div>

        <div class="dashboard-section">
          <h2>My Events</h2>

          <div *ngIf="loading" class="loading">
            <div class="spinner"></div>
          </div>

          <div *ngIf="!loading && organizedEvents.length === 0" class="empty-state">
            <div class="empty-icon">🎪</div>
            <h3>No Events Created Yet</h3>
            <p>Start by creating your first event</p>
            <a routerLink="/events/create" class="btn-primary">Create Event</a>
          </div>

          <div *ngIf="!loading && organizedEvents.length > 0" class="events-grid">
            <div *ngFor="let event of organizedEvents" class="event-card">
              <div class="event-header">
                <div class="event-category">{{event.category}}</div>
                <div class="event-status" [class]="'status-' + event.status.toLowerCase()">
                  {{event.status}}
                </div>
              </div>

              <h3 class="event-title">{{event.title}}</h3>

              <div class="event-stats">
                <div class="stat-item">
                  <div class="stat-number">{{event.participantCount}}</div>
                  <div class="stat-text">Participants</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{event.attendanceCount}}</div>
                  <div class="stat-text">Attended</div>
                </div>
              </div>

              <div class="event-meta">
                <div class="meta-item">
                  <span>📅</span>
                  <span>{{formatDate(event.date)}}</span>
                </div>
                <div class="meta-item">
                  <span>📍</span>
                  <span>{{event.location}}</span>
                </div>
              </div>

              <div class="event-actions">
                <a [routerLink]="['/events', event._id]" class="btn-action">View</a>
                <button (click)="deleteEvent(event._id)" class="btn-action btn-delete">Delete</button>
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
      display: flex;
      justify-content: space-between;
      align-items: center;
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

    .btn-create {
      background: linear-gradient(135deg, var(--gold), #B8941E);
      color: #0B0B0B;
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-create:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
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

    .dashboard-section h2 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 2rem;
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

    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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
    }

    .event-header {
      display: flex;
      justify-content: space-between;
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

    .event-status {
      padding: 0.375rem 0.875rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-upcoming {
      background: rgba(59, 130, 246, 0.1);
      color: #3B82F6;
    }

    .status-ongoing {
      background: rgba(34, 197, 94, 0.1);
      color: #22C55E;
    }

    .status-completed {
      background: rgba(107, 114, 128, 0.1);
      color: #6B7280;
    }

    .event-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .event-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
      padding: 1rem;
      background: var(--bg-primary);
      border-radius: 8px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--gold);
    }

    .stat-text {
      font-size: 0.85rem;
      color: var(--text-secondary);
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

    .event-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }

    .btn-action {
      padding: 0.625rem;
      border-radius: 6px;
      text-align: center;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      border: none;
      background: linear-gradient(135deg, var(--gold), #B8941E);
      color: #0B0B0B;
    }

    .btn-delete {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
    }

    .btn-delete:hover {
      border-color: #EF4444;
      color: #EF4444;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .events-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OrganizerDashboardComponent implements OnInit {
  organizedEvents: any[] = [];
  loading = false;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadOrganizedEvents();
  }

  loadOrganizedEvents() {
    this.loading = true;
    this.eventService.getOrganizedEvents().subscribe({
      next: (events) => {
        this.organizedEvents = events;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.loading = false;
      }
    });
  }

  getTotalParticipants(): number {
    return this.organizedEvents.reduce((sum, event) => sum + event.participantCount, 0);
  }

  getTotalAttendance(): number {
    return this.organizedEvents.reduce((sum, event) => sum + event.attendanceCount, 0);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  deleteEvent(id: string) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.organizedEvents = this.organizedEvents.filter(e => e._id !== id);
        },
        error: (err) => {
          console.error('Error deleting event:', err);
          alert('Failed to delete event');
        }
      });
    }
  }
}
