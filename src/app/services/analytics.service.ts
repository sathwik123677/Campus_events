import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:3000/api/analytics';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getAttendanceTrends(days?: number): Observable<any> {
    const options: any = {
      headers: this.authService.getAuthHeaders()
    };

    if (days) {
      options.params = { days: days.toString() };
    }

    return this.http.get(`${this.apiUrl}/trends`, options);
  }

  getEventAnalytics(eventId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/event/${eventId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  exportData(type: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/export/${type}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
