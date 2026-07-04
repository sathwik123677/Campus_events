import { io } from 'socket.io-client';

let socket = null;

export const socketService = {
  connect: () => {
    if (!socket) {
      socket = io(import.meta.env.VITE_SOCKET_URL || 'http://127.0.0.1:3000');
    }
    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  joinEvent: (eventId) => {
    if (socket) {
      socket.emit('joinEvent', eventId);
    }
  },

  leaveEvent: (eventId) => {
    if (socket) {
      socket.emit('leaveEvent', eventId);
    }
  },

  onParticipantCountUpdate: (callback) => {
    if (socket) {
      socket.on('participantCountUpdate', callback);
    }
    return () => {
      if (socket) {
        socket.off('participantCountUpdate', callback);
      }
    };
  },

  onAttendanceUpdate: (callback) => {
    if (socket) {
      socket.on('attendanceUpdate', callback);
    }
    return () => {
      if (socket) {
        socket.off('attendanceUpdate', callback);
      }
    };
  }
};
