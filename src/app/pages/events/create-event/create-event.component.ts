import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { ParticleBackgroundComponent } from '../../../components/particle-background/particle-background.component';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, ParticleBackgroundComponent],
  template: `
    <app-particle-background></app-particle-background>
    <app-header></app-header>

    <div class="create-event-page">
      <div class="container">
        <button routerLink="/dashboard/organizer" class="btn-back">← Back to Dashboard</button>

        <div class="page-header">
          <h1>Create New Event</h1>
          <p>Fill in the details to create your event</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="event-form">
          <div class="form-row">
            <div class="form-group">
              <label for="title">Event Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                [(ngModel)]="eventData.title"
                required
                placeholder="Amazing Campus Event"
                [disabled]="loading"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea
              id="description"
              name="description"
              [(ngModel)]="eventData.description"
              required
              rows="4"
              placeholder="Describe your event in detail..."
              [disabled]="loading"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="category">Category *</label>
              <select
                id="category"
                name="category"
                [(ngModel)]="eventData.category"
                required
                [disabled]="loading"
              >
                <option value="">Select Category</option>
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Conference">Conference</option>
                <option value="Social">Social</option>
              </select>
            </div>

            <div class="form-group">
              <label for="college">College/University *</label>
              <input
                type="text"
                id="college"
                name="college"
                [(ngModel)]="eventData.college"
                required
                placeholder="MIT, Stanford, etc."
                [disabled]="loading"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="date">Event Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                [(ngModel)]="eventData.date"
                required
                [disabled]="loading"
              >
            </div>

            <div class="form-group">
              <label for="startTime">Start Time *</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                [(ngModel)]="eventData.startTime"
                required
                [disabled]="loading"
              >
            </div>

            <div class="form-group">
              <label for="endTime">End Time *</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                [(ngModel)]="eventData.endTime"
                required
                [disabled]="loading"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              [(ngModel)]="eventData.location"
              required
              placeholder="Main Auditorium, Building A"
              [disabled]="loading"
            >
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="maxParticipants">Max Participants (Optional)</label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                [(ngModel)]="eventData.maxParticipants"
                placeholder="Leave empty for unlimited"
                [disabled]="loading"
              >
            </div>

            <div class="form-group">
              <label for="registrationDeadline">Registration Deadline (Optional)</label>
              <input
                type="date"
                id="registrationDeadline"
                name="registrationDeadline"
                [(ngModel)]="eventData.registrationDeadline"
                [disabled]="loading"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="banner">Banner Image URL (Optional)</label>
            <input
              type="url"
              id="banner"
              name="banner"
              [(ngModel)]="eventData.banner"
              placeholder="https://images.pexels.com/..."
              [disabled]="loading"
            >
          </div>

          <div class="error-message" *ngIf="error">
            {{ error }}
          </div>

          <div class="form-actions">
            <button type="button" routerLink="/dashboard/organizer" class="btn-cancel" [disabled]="loading">
              Cancel
            </button>
            <button type="submit" class="btn-submit" [disabled]="loading">
              <span *ngIf="!loading">Create Event</span>
              <span *ngIf="loading">Creating...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .create-event-page {
      min-height: 100vh;
      padding: 2rem 0 4rem;
      position: relative;
    }

    .container {
      max-width: 900px;
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

    .page-header {
      text-align: center;
      margin-bottom: 3rem;
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

    .event-form {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 3rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .form-group label {
      font-weight: 500;
      color: var(--text-primary);
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.875rem 1rem;
      font-size: 1rem;
      color: var(--text-primary);
      transition: all 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
    }

    .form-group input:disabled,
    .form-group select:disabled,
    .form-group textarea:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .form-group textarea {
      resize: vertical;
    }

    .error-message {
      background: rgba(220, 38, 38, 0.1);
      border: 1px solid rgba(220, 38, 38, 0.3);
      color: #EF4444;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-cancel,
    .btn-submit {
      padding: 1rem 2rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
    }

    .btn-cancel:hover:not(:disabled) {
      border-color: var(--gold);
      color: var(--gold);
    }

    .btn-submit {
      background: linear-gradient(135deg, var(--gold), #B8941E);
      color: #0B0B0B;
      border: none;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
    }

    .btn-cancel:disabled,
    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .event-form {
        padding: 2rem;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .btn-cancel,
      .btn-submit {
        width: 100%;
      }
    }
  `]
})
export class CreateEventComponent {
  eventData: any = {
    title: '',
    description: '',
    category: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    college: '',
    maxParticipants: null,
    registrationDeadline: '',
    banner: ''
  };
  loading = false;
  error = '';

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.eventService.createEvent(this.eventData).subscribe({
      next: (event) => {
        this.loading = false;
        this.router.navigate(['/events', event._id]);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to create event. Please try again.';
      }
    });
  }
}
