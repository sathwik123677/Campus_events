import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <a routerLink="/" class="logo">
            <span class="logo-icon">✨</span>
            <span class="logo-text">CampusEvents</span>
          </a>

          <nav class="nav" [class.active]="mobileMenuOpen">
            <a routerLink="/events" routerLinkActive="active" class="nav-link">Discover</a>

            <ng-container *ngIf="currentUser">
              <a *ngIf="currentUser.role === 'STUDENT'"
                 routerLink="/dashboard/student"
                 routerLinkActive="active"
                 class="nav-link">My Dashboard</a>

              <a *ngIf="currentUser.role === 'ORGANIZER'"
                 routerLink="/dashboard/organizer"
                 routerLinkActive="active"
                 class="nav-link">Organizer</a>

              <a *ngIf="currentUser.role === 'ADMIN'"
                 routerLink="/dashboard/admin"
                 routerLinkActive="active"
                 class="nav-link">Admin</a>

              <div class="user-menu">
                <div class="user-info">
                  <img [src]="currentUser.avatar || 'https://via.placeholder.com/40'"
                       alt="Avatar"
                       class="avatar">
                  <span class="user-name">{{currentUser.name}}</span>
                </div>
                <button (click)="logout()" class="btn-logout">Logout</button>
              </div>
            </ng-container>

            <ng-container *ngIf="!currentUser">
              <a routerLink="/login" routerLinkActive="active" class="nav-link">Login</a>
              <a routerLink="/register" class="btn-primary">Get Started</a>
            </ng-container>

            <button (click)="toggleTheme()" class="theme-toggle" [attr.aria-label]="'Toggle ' + (isDark ? 'Light' : 'Dark') + ' Mode'">
              <span class="theme-icon">{{ isDark ? '☀️' : '🌙' }}</span>
            </button>
          </nav>

          <button class="mobile-toggle" (click)="toggleMobileMenu()" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--header-bg);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border-color);
      padding: 1rem 0;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--gold);
      transition: transform 0.2s;
    }

    .logo:hover {
      transform: scale(1.05);
    }

    .logo-icon {
      font-size: 1.8rem;
    }

    .nav {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
      position: relative;
    }

    .nav-link:hover,
    .nav-link.active {
      color: var(--gold);
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--gold);
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--gold), #B8941E);
      color: #0B0B0B;
      padding: 0.625rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--gold);
    }

    .user-name {
      color: var(--text-primary);
      font-weight: 500;
    }

    .btn-logout {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-logout:hover {
      border-color: var(--gold);
      color: var(--gold);
    }

    .theme-toggle {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .theme-toggle:hover {
      border-color: var(--gold);
      transform: rotate(180deg);
    }

    .theme-icon {
      font-size: 1.2rem;
    }

    .mobile-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }

    .mobile-toggle span {
      width: 25px;
      height: 3px;
      background: var(--text-primary);
      border-radius: 2px;
      transition: all 0.3s;
    }

    @media (max-width: 768px) {
      .nav {
        position: fixed;
        top: 70px;
        right: -100%;
        width: 80%;
        max-width: 300px;
        height: calc(100vh - 70px);
        background: var(--card-bg);
        flex-direction: column;
        align-items: flex-start;
        padding: 2rem;
        gap: 1.5rem;
        transition: right 0.3s;
        border-left: 1px solid var(--border-color);
      }

      .nav.active {
        right: 0;
      }

      .mobile-toggle {
        display: flex;
      }

      .user-menu {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  isDark = true;
  mobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.themeService.theme$.subscribe(theme => {
      this.isDark = theme === 'dark';
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout();
    this.mobileMenuOpen = false;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
