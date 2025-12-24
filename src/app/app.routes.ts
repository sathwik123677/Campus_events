import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'events',
    loadComponent: () => import('./pages/events/events-list/events-list.component').then(m => m.EventsListComponent)
  },
  {
    path: 'events/:id',
    loadComponent: () => import('./pages/events/event-detail/event-detail.component').then(m => m.EventDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard/student',
    loadComponent: () => import('./pages/dashboard/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['STUDENT'] }
  },
  {
    path: 'dashboard/organizer',
    loadComponent: () => import('./pages/dashboard/organizer-dashboard/organizer-dashboard.component').then(m => m.OrganizerDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ORGANIZER', 'ADMIN'] }
  },
  {
    path: 'dashboard/admin',
    loadComponent: () => import('./pages/dashboard/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'events/create',
    loadComponent: () => import('./pages/events/create-event/create-event.component').then(m => m.CreateEventComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ORGANIZER', 'ADMIN'] }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
