import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../services/analytics.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { ParticleBackgroundComponent } from '../../../components/particle-background/particle-background.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ParticleBackgroundComponent],
  template: `
    <app-particle-background></app-particle-background>
    <app-header></app-header>

    <div class="dashboard-page">
      <div class="container">
        <div class="page-header">
          <h1>Admin Dashboard</h1>
          <p>Overview of platform analytics and metrics</p>
        </div>

        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
        </div>

        <div *ngIf="!loading && dashboardData">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-content">
                <div class="stat-value">{{dashboardData.stats.totalUsers}}</div>
                <div class="stat-label">Total Users</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">🎪</div>
              <div class="stat-content">
                <div class="stat-value">{{dashboardData.stats.totalEvents}}</div>
                <div class="stat-label">Total Events</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">📝</div>
              <div class="stat-content">
                <div class="stat-value">{{dashboardData.stats.totalParticipants}}</div>
                <div class="stat-label">Total Registrations</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <div class="stat-value">{{dashboardData.stats.totalAttendance}}</div>
                <div class="stat-label">Total Attendance</div>
              </div>
            </div>
          </div>

          <div class="dashboard-grid">
            <div class="chart-card">
              <h3>Users by Role</h3>
              <div class="chart-items">
                <div *ngFor="let item of dashboardData.usersByRole" class="chart-item">
                  <div class="chart-label">{{item._id}}</div>
                  <div class="chart-bar">
                    <div class="chart-fill" [style.width.%]="(item.count / dashboardData.stats.totalUsers) * 100"></div>
                  </div>
                  <div class="chart-value">{{item.count}}</div>
                </div>
              </div>
            </div>

            <div class="chart-card">
              <h3>Events by Category</h3>
              <div class="chart-items">
                <div *ngFor="let item of dashboardData.eventsByCategory" class="chart-item">
                  <div class="chart-label">{{item._id}}</div>
                  <div class="chart-bar">
                    <div class="chart-fill" [style.width.%]="(item.count / dashboardData.stats.totalEvents) * 100"></div>
                  </div>
                  <div class="chart-value">{{item.count}}</div>
                </div>
              </div>
            </div>

            <div class="chart-card">
              <h3>Events by Status</h3>
              <div class="chart-items">
                <div *ngFor="let item of dashboardData.eventsByStatus" class="chart-item">
                  <div class="chart-label">{{item._id}}</div>
                  <div class="chart-bar">
                    <div class="chart-fill" [style.width.%]="(item.count / dashboardData.stats.totalEvents) * 100"></div>
                  </div>
                  <div class="chart-value">{{item.count}}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Popular Events</h2>
            <div class="events-list">
              <div *ngFor="let event of dashboardData.popularEvents" class="event-item">
                <div class="event-info">
                  <div class="event-name">{{event.title}}</div>
                  <div class="event-meta">
                    <span>{{event.category}}</span>
                    <span>•</span>
                    <span>{{event.organizer?.name}}</span>
                  </div>
                </div>
                <div class="event-stats-inline">
                  <div class="stat">
                    <span class="stat-icon">👥</span>
                    <span>{{event.participantCount}}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">✅</span>
                    <span>{{event.attendanceCount}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Recent Users</h2>
            <div class="users-list">
              <div *ngFor="let user of dashboardData.recentUsers" class="user-item">
                <div class="user-info">
                  <div class="user-name">{{user.name}}</div>
                  <div class="user-email">{{user.email}}</div>
                </div>
                <div class="user-meta">
                  <div class="user-role" [class]="'role-' + user.role.toLowerCase()">
                    {{user.role}}
                  </div>
                  <div class="user-college">{{user.college}}</div>
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

    .stats-grid {
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

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .chart-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 2rem;
    }

    .chart-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1.5rem;
    }

    .chart-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .chart-item {
      display: grid;
      grid-template-columns: 100px 1fr 60px;
      align-items: center;
      gap: 1rem;
    }

    .chart-label {
      font-size: 0.9rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .chart-bar {
      background: var(--bg-primary);
      border-radius: 4px;
      height: 24px;
      overflow: hidden;
    }

    .chart-fill {
      background: linear-gradient(135deg, var(--gold), #B8941E);
      height: 100%;
      transition: width 0.3s;
    }

    .chart-value {
      font-weight: 600;
      color: var(--text-primary);
      text-align: right;
    }

    .section {
      margin-bottom: 4rem;
    }

    .section h2 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 2rem;
    }

    .events-list,
    .users-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .event-item,
    .user-item {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s;
    }

    .event-item:hover,
    .user-item:hover {
      border-color: var(--gold);
    }

    .event-name,
    .user-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .event-meta,
    .user-email {
      font-size: 0.9rem;
      color: var(--text-secondary);
      display: flex;
      gap: 0.5rem;
    }

    .event-stats-inline {
      display: flex;
      gap: 1.5rem;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-primary);
      font-weight: 600;
    }

    .stat-icon {
      font-size: 1.2rem;
    }

    .user-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-role {
      padding: 0.375rem 0.875rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .role-student {
      background: rgba(59, 130, 246, 0.1);
      color: #3B82F6;
    }

    .role-organizer {
      background: rgba(168, 85, 247, 0.1);
      color: #A855F7;
    }

    .role-admin {
      background: rgba(239, 68, 68, 0.1);
      color: #EF4444;
    }

    .user-college {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .event-item,
      .user-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  dashboardData: any = null;
  loading = false;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    this.analyticsService.getDashboardStats().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading = false;
      }
    });
  }
}
