import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  college: string;
  organizer: any;
  maxParticipants?: number;
  registrationDeadline?: Date;
  banner: string;
  status: string;
  qrCode?: string;
  participantCount: number;
  attendanceCount: number;
  isParticipant?: boolean;
}

export interface EventsResponse {
  events: Event[];
  totalPages: number;
  currentPage: number;
  totalEvents: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api/events';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllEvents(params?: any): Observable<EventsResponse> {
    return this.http.get<EventsResponse>(this.apiUrl, { params });
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createEvent(eventData: any): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, eventData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateEvent(id: string, eventData: any): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, eventData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  joinEvent(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/join`, {}, {
      headers: this.authService.getAuthHeaders()
    });
  }

  leaveEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/leave`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getMyEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/my-events`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getOrganizedEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/organized`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getEventParticipants(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/participants`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
