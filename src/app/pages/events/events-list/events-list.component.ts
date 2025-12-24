import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService, Event } from '../../../services/event.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { ParticleBackgroundComponent } from '../../../components/particle-background/particle-background.component';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, ParticleBackgroundComponent],
  template: `
    <app-particle-background></app-particle-background>
    <app-header></app-header>

    <div class="events-page">
      <div class="container">
        <div class="page-header">
          <h1>Discover Events</h1>
          <p>Find the perfect event for your interests</p>
        </div>

        <div class="filters">
          <input
            type="text"
            placeholder="Search events..."
            [(ngModel)]="filters.search"
            (ngModelChange)="onFilterChange()"
            class="search-input"
          >

          <select [(ngModel)]="filters.category" (ngModelChange)="onFilterChange()" class="filter-select">
            <option value="">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Conference">Conference</option>
            <option value="Social">Social</option>
          </select>

          <select [(ngModel)]="filters.status" (ngModelChange)="onFilterChange()" class="filter-select">
            <option value="">All Status</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
          <p>Loading events...</p>
        </div>

        <div *ngIf="!loading && events.length === 0" class="empty-state">
          <div class="empty-icon">📅</div>
          <h3>No events found</h3>
          <p>Try adjusting your filters or check back later</p>
        </div>

        <div *ngIf="!loading && events.length > 0" class="events-grid">
          <div *ngFor="let event of events" class="event-card">
            <div class="event-banner">
              <img [src]="event.banner" [alt]="event.title">
              <div class="event-category">{{event.category}}</div>
              <div class="event-status" [class]="'status-' + event.status.toLowerCase()">
                {{event.status}}
              </div>
            </div>

            <div class="event-content">
              <h3 class="event-title">{{event.title}}</h3>

              <div class="event-meta">
                <div class="meta-item">
                  <span class="icon">📅</span>
                  <span>{{formatDate(event.date)}}</span>
                </div>
                <div class="meta-item">
                  <span class="icon">⏰</span>
                  <span>{{event.startTime}} - {{event.endTime}}</span>
                </div>
                <div class="meta-item">
                  <span class="icon">📍</span>
                  <span>{{event.location}}</span>
                </div>
                <div class="meta-item">
                  <span class="icon">👥</span>
                  <span>{{event.participantCount}} participants</span>
                </div>
              </div>

              <p class="event-description">{{truncateText(event.description, 100)}}</p>

              <div class="event-footer">
                <div class="organizer">
                  <img [src]="event.organizer?.avatar || 'https://via.placeholder.com/30'"
                       [alt]="event.organizer?.name"
                       class="organizer-avatar">
                  <span>{{event.organizer?.name}}</span>
                </div>

                <a [routerLink]="['/events', event._id]" class="btn-view">
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="totalPages > 1" class="pagination">
          <button
            (click)="goToPage(currentPage - 1)"
            [disabled]="currentPage === 1"
            class="pagination-btn"
          >
            Previous
          </button>

          <span class="page-info">Page {{currentPage}} of {{totalPages}}</span>

          <button
            (click)="goToPage(currentPage + 1)"
            [disabled]="currentPage === totalPages"
            class="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .events-page {
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
      text-align: center;
      margin-bottom: 3rem;
      padding-top: 2rem;
    }

    .page-header h1 {
      font-size: 3rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .page-header p {
      font-size: 1.2rem;
      color: var(--text-secondary);
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .search-input {
      flex: 1;
      min-width: 250px;
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.875rem 1rem;
      font-size: 1rem;
      color: var(--text-primary);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--gold);
    }

    .filter-select {
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.875rem 1rem;
      font-size: 1rem;
      color: var(--text-primary);
      cursor: pointer;
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
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 5rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: var(--text-secondary);
    }

    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .event-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s;
    }

    .event-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(212, 175, 55, 0.2);
      border-color: var(--gold);
    }

    .event-banner {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .event-banner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .event-category {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: rgba(11, 11, 11, 0.8);
      color: var(--gold);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .event-status {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .status-upcoming {
      background: rgba(59, 130, 246, 0.2);
      color: #3B82F6;
    }

    .status-ongoing {
      background: rgba(34, 197, 94, 0.2);
      color: #22C55E;
    }

    .status-completed {
      background: rgba(107, 114, 128, 0.2);
      color: #6B7280;
    }

    .event-content {
      padding: 1.5rem;
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

    .icon {
      font-size: 1rem;
    }

    .event-description {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .event-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }

    .organizer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .organizer-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      object-fit: cover;
    }

    .btn-view {
      background: linear-gradient(135deg, var(--gold), #B8941E);
      color: #0B0B0B;
      padding: 0.5rem 1.25rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-view:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      margin-top: 3rem;
    }

    .pagination-btn {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pagination-btn:hover:not(:disabled) {
      border-color: var(--gold);
      color: var(--gold);
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .events-grid {
        grid-template-columns: 1fr;
      }

      .page-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class EventsListComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  filters = {
    search: '',
    category: '',
    status: ''
  };

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    const params = {
      page: this.currentPage,
      ...this.filters
    };

    this.eventService.getAllEvents(params).subscribe({
      next: (response) => {
        this.events = response.events;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.loading = false;
      }
    });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadEvents();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadEvents();
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}
