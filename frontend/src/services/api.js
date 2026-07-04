const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Something went wrong');
  }
  return response.json();
};

export const authService = {
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    const user = await handleResponse(res);
    if (user.token) {
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return user;
  },

  register: async (data) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const user = await handleResponse(res);
    if (user.token) {
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return user;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  updateProfile: async (data) => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const updatedUser = await handleResponse(res);
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      updatedUser.token = currentToken;
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return updatedUser;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export const eventService = {
  getAllEvents: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE}/events?${query.toString()}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getEventById: async (id) => {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createEvent: async (data) => {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteEvent: async (id) => {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  joinEvent: async (id) => {
    const res = await fetch(`${API_BASE}/events/${id}/join`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  leaveEvent: async (id) => {
    const res = await fetch(`${API_BASE}/events/${id}/leave`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getMyEvents: async () => {
    const res = await fetch(`${API_BASE}/events/my-events`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getOrganizedEvents: async () => {
    const res = await fetch(`${API_BASE}/events/organized`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getEventParticipants: async (id) => {
    const res = await fetch(`${API_BASE}/events/${id}/participants`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  }
};

export const attendanceService = {
  markAttendance: async (eventId, userId) => {
    const res = await fetch(`${API_BASE}/attendance/mark`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ eventId, userId }),
    });
    return handleResponse(res);
  },

  getUserAttendanceHistory: async () => {
    const res = await fetch(`${API_BASE}/attendance/my-history`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getEventAttendance: async (eventId) => {
    const res = await fetch(`${API_BASE}/attendance/event/${eventId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  }
};

export const analyticsService = {
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/analytics/dashboard`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  }
};
