import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  joinEvent(eventId: string) {
    this.socket.emit('joinEvent', eventId);
  }

  leaveEvent(eventId: string) {
    this.socket.emit('leaveEvent', eventId);
  }

  onParticipantCountUpdate(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('participantCountUpdate', (data) => {
        observer.next(data);
      });
    });
  }

  onAttendanceUpdate(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('attendanceUpdate', (data) => {
        observer.next(data);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
