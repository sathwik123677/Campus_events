import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'http://localhost:3000/api/attendance';

  constructor(private http: HttpClient, private authService: AuthService) {}

  markAttendance(eventId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark`,
      { eventId, userId },
      { headers: this.authService.getAuthHeaders() }
    );
  }

  getEventAttendance(eventId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/event/${eventId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getUserAttendanceHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-history`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  verifyQRCode(eventId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-qr`,
      { eventId },
      { headers: this.authService.getAuthHeaders() }
    );
  }
}
