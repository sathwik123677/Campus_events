import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService, Event } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { SocketService } from '../../../services/socket.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { ParticleBackgroundComponent } from '../../../components/particle-background/particle-background.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, ParticleBackgroundComponent],
  template: `
    <app-particle-background></app-particle-background>
    <app-header></app-header>

    <div class="event-detail-page">
      <div class="container">
        <button routerLink="/events" class="btn-back">← Back to Events</button>

        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
        </div>

        <div *ngIf="!loading && event" class="event-detail">
          <div class="event-banner">
            <img [src]="event.banner" [alt]="event.title">
            <div class="banner-overlay">
              <div class="event-category">{{event.category}}</div>
              <div class="event-status" [class]="'status-' + event.status.toLowerCase()">
                {{event.status}}
              </div>
            </div>
          </div>

          <div class="event-content-grid">
            <div class="main-content">
              <h1 class="event-title">{{event.title}}</h1>

              <div class="event-meta-grid">
                <div class="meta-card">
                  <span class="meta-icon">📅</span>
                  <div>
                    <div class="meta-label">Date</div>
                    <div class="meta-value">{{formatDate(event.date)}}</div>
                  </div>
                </div>

                <div class="meta-card">
                  <span class="meta-icon">⏰</span>
                  <div>
                    <div class="meta-label">Time</div>
                    <div class="meta-value">{{event.startTime}} - {{event.endTime}}</div>
                  </div>
                </div>

                <div class="meta-card">
                  <span class="meta-icon">📍</span>
                  <div>
                    <div class="meta-label">Location</div>
                    <div class="meta-value">{{event.location}}</div>
                  </div>
                </div>

                <div class="meta-card">
                  <span class="meta-icon">🏛️</span>
                  <div>
                    <div class="meta-label">College</div>
                    <div class="meta-value">{{event.college}}</div>
                  </div>
                </div>
              </div>

              <div class="section">
                <h2>About This Event</h2>
                <p class="event-description">{{event.description}}</p>
              </div>

              <div class="section">
                <h2>Organizer</h2>
                <div class="organizer-card">
                  <img [src]="event.organizer?.avatar || 'https://via.placeholder.com/60'"
                       [alt]="event.organizer?.name"
                       class="organizer-avatar">
                  <div>
                    <div class="organizer-name">{{event.organizer?.name}}</div>
                    <div class="organizer-college">{{event.organizer?.college}}</div>
                    <div class="organizer-email">{{event.organizer?.email}}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="sidebar">
              <div class="stats-card">
                <h3>Event Stats</h3>
                <div class="stat-item">
                  <span class="stat-icon">👥</span>
                  <div>
                    <div class="stat-value">{{event.participantCount}}</div>
                    <div class="stat-label">Participants</div>
                  </div>
                </div>
                <div class="stat-item">
                  <span class="stat-icon">✅</span>
                  <div>
                    <div class="stat-value">{{event.attendanceCount}}</div>
                    <div class="stat-label">Attended</div>
                  </div>
                </div>
              </div>

              <div class="action-card" *ngIf="currentUser">
                <div *ngIf="!event.isParticipant">
                  <button (click)="joinEvent()" [disabled]="actionLoading" class="btn-join">
                    <span *ngIf="!actionLoading">Join Event</span>
                    <span *ngIf="actionLoading">Joining...</span>
                  </button>
                </div>

                <div *ngIf="event.isParticipant">
                  <div class="joined-badge">
                    <span class="check-icon">✓</span>
                    You're registered!
                  </div>
                  <button (click)="leaveEvent()" [disabled]="actionLoading" class="btn-leave">
                    <span *ngIf="!actionLoading">Leave Event</span>
                    <span *ngIf="actionLoading">Leaving...</span>
                  </button>
                </div>
              </div>

              <div class="qr-card" *ngIf="event.qrCode && event.isParticipant">
                <h3>Your QR Code</h3>
                <p class="qr-description">Show this QR code at the event for attendance</p>
                <div class="qr-code">
                  <img [src]="event.qrCode" alt="Event QR Code">
                </div>
              </div>

              <div *ngIf="message" class="message" [class]="messageType">
                {{message}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .event-detail-page {
      min-height: 100vh;
      padding: 2rem 0 4rem;
      position: relative;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .btn-back {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      margin-bottom: 2rem;
      transition: all 0.2s;
    }

    .btn-back:hover {
      border-color: var(--gold);
      color: var(--gold);
    }

    .loading {
      text-align: center;
      padding: 4rem 0;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid var(--border-color);
      border-top-color: var(--gold);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .event-detail {
      margin-top: 2rem;
    }

    .event-banner {
      position: relative;
      height: 400px;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 3rem;
    }

    .event-banner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .banner-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
    }

    .event-category {
      background: rgba(11, 11, 11, 0.8);
      color: var(--gold);
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
    }

    .event-status {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
    }

    .status-upcoming {
      background: rgba(59, 130, 246, 0.9);
      color: white;
    }

    .status-ongoing {
      background: rgba(34, 197, 94, 0.9);
      color: white;
    }

    .status-completed {
      background: rgba(107, 114, 128, 0.9);
      color: white;
    }

    .event-content-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 3rem;
    }

    .event-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 2rem;
    }

    .event-meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 3rem;
    }

    .meta-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .meta-icon {
      font-size: 2rem;
    }

    .meta-label {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 0.25rem;
    }

    .meta-value {
      font-weight: 600;
      color: var(--text-primary);
    }

    .section {
      margin-bottom: 3rem;
    }

    .section h2 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .event-description {
      color: var(--text-secondary);
      line-height: 1.8;
      font-size: 1.1rem;
    }

    .organizer-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .organizer-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--gold);
    }

    .organizer-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .organizer-college,
    .organizer-email {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .stats-card,
    .action-card,
    .qr-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 2rem;
    }

    .stats-card h3,
    .qr-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1.5rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid var(--border-color);
    }

    .stat-item:last-child {
      border-bottom: none;
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--gold);
    }

    .stat-label {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .btn-join,
    .btn-leave {
      width: 100%;
      padding: 1rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-join {
      background: linear-gradient(135deg, var(--gold), #B8941E);
      color: #0B0B0B;
    }

    .btn-join:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
    }

    .btn-leave {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      margin-top: 1rem;
    }

    .btn-leave:hover:not(:disabled) {
      border-color: #EF4444;
      color: #EF4444;
    }

    .btn-join:disabled,
    .btn-leave:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .joined-badge {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #22C55E;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .check-icon {
      font-size: 1.25rem;
    }

    .qr-description {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
    }

    .qr-code {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      display: flex;
      justify-content: center;
    }

    .qr-code img {
      width: 100%;
      max-width: 250px;
      height: auto;
    }

    .message {
      padding: 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      text-align: center;
    }

    .message.success {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #22C55E;
    }

    .message.error {
      background: rgba(220, 38, 38, 0.1);
      border: 1px solid rgba(220, 38, 38, 0.3);
      color: #EF4444;
    }

    @media (max-width: 1024px) {
      .event-content-grid {
        grid-template-columns: 1fr;
      }

      .event-meta-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .event-title {
        font-size: 2rem;
      }

      .event-banner {
        height: 250px;
      }
    }
  `]
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: Event | null = null;
  loading = false;
  actionLoading = false;
  message = '';
  messageType = '';
  currentUser: any = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(eventId);
      this.setupRealTimeUpdates(eventId);
    }
  }

  loadEvent(id: string) {
    this.loading = true;
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading event:', err);
        this.loading = false;
        this.router.navigate(['/events']);
      }
    });
  }

  setupRealTimeUpdates(eventId: string) {
    this.socketService.joinEvent(eventId);

    const participantSub = this.socketService.onParticipantCountUpdate().subscribe(data => {
      if (data.eventId === eventId && this.event) {
        this.event.participantCount = data.count;
      }
    });

    const attendanceSub = this.socketService.onAttendanceUpdate().subscribe(data => {
      if (data.eventId === eventId && this.event) {
        this.event.attendanceCount = data.count;
      }
    });

    this.subscriptions.push(participantSub, attendanceSub);
  }

  joinEvent() {
    if (!this.event) return;

    this.actionLoading = true;
    this.message = '';

    this.eventService.joinEvent(this.event._id).subscribe({
      next: () => {
        this.actionLoading = false;
        this.message = 'Successfully joined the event!';
        this.messageType = 'success';
        if (this.event) {
          this.event.isParticipant = true;
        }
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        this.actionLoading = false;
        this.message = err.error?.message || 'Failed to join event';
        this.messageType = 'error';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  leaveEvent() {
    if (!this.event) return;

    this.actionLoading = true;
    this.message = '';

    this.eventService.leaveEvent(this.event._id).subscribe({
      next: () => {
        this.actionLoading = false;
        this.message = 'You have left the event';
        this.messageType = 'success';
        if (this.event) {
          this.event.isParticipant = false;
        }
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        this.actionLoading = false;
        this.message = err.error?.message || 'Failed to leave event';
        this.messageType = 'error';
        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  ngOnDestroy() {
    if (this.event) {
      this.socketService.leaveEvent(this.event._id);
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
