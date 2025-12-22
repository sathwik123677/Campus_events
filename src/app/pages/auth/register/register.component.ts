import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterData } from '../../../services/auth.service';
import { ParticleBackgroundComponent } from '../../../components/particle-background/particle-background.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ParticleBackgroundComponent],
  template: `
    <app-particle-background></app-particle-background>
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Join CampusEvents</h1>
          <p>Create your account to get started</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="formData.name"
              required
              placeholder="John Doe"
              [disabled]="loading"
            >
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="formData.email"
              required
              placeholder="your@email.com"
              [disabled]="loading"
            >
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="formData.password"
              required
              minlength="6"
              placeholder="••••••••"
              [disabled]="loading"
            >
          </div>

          <div class="form-group">
            <label for="college">College/University</label>
            <input
              type="text"
              id="college"
              name="college"
              [(ngModel)]="formData.college"
              required
              placeholder="MIT, Stanford, etc."
              [disabled]="loading"
            >
          </div>

          <div class="form-group">
            <label for="department">Department (Optional)</label>
            <input
              type="text"
              id="department"
              name="department"
              [(ngModel)]="formData.department"
              placeholder="Computer Science, etc."
              [disabled]="loading"
            >
          </div>

          <div class="form-group">
            <label for="role">I am a</label>
            <select
              id="role"
              name="role"
              [(ngModel)]="formData.role"
              required
              [disabled]="loading"
            >
              <option value="STUDENT">Student</option>
              <option value="ORGANIZER">Event Organizer</option>
            </select>
          </div>

          <div class="error-message" *ngIf="error">
            {{ error }}
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading">
            <span *ngIf="!loading">Create Account</span>
            <span *ngIf="loading">Creating Account...</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Login here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
    }

    .auth-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 3rem;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      margin: 2rem auto;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, var(--gold), #EDEDED);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .auth-header p {
      color: var(--text-secondary);
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 500;
      color: var(--text-primary);
    }

    .form-group input,
    .form-group select {
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.875rem 1rem;
      font-size: 1rem;
      color: var(--text-primary);
      transition: all 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
    }

    .form-group input:disabled,
    .form-group select:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message {
      background: rgba(220, 38, 38, 0.1);
      border: 1px solid rgba(220, 38, 38, 0.3);
      color: #EF4444;
      padding: 0.875rem;
      border-radius: 8px;
      font-size: 0.9rem;
    }

    .btn-submit {
      background: linear-gradient(135deg, var(--gold), #B8941E);
      color: #0B0B0B;
      padding: 1rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 0.5rem;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      color: var(--text-secondary);
    }

    .auth-footer a {
      color: var(--gold);
      text-decoration: none;
      font-weight: 600;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    @media (max-width: 640px) {
      .auth-card {
        padding: 2rem;
      }

      .auth-header h1 {
        font-size: 1.75rem;
      }
    }
  `]
})
export class RegisterComponent {
  formData: RegisterData = {
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    college: '',
    department: ''
  };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.register(this.formData).subscribe({
      next: (user) => {
        this.loading = false;
        if (user.role === 'STUDENT') {
          this.router.navigate(['/dashboard/student']);
        } else if (user.role === 'ORGANIZER') {
          this.router.navigate(['/dashboard/organizer']);
        } else {
          this.router.navigate(['/events']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
