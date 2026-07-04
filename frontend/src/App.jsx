import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import EventsList from './pages/EventsList';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import StudentDashboard from './pages/StudentDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect role mismatch to their correct page or home
    if (currentUser.role === 'STUDENT') return <Navigate to="/dashboard/student" replace />;
    if (currentUser.role === 'ORGANIZER') return <Navigate to="/dashboard/organizer" replace />;
    if (currentUser.role === 'ADMIN') return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

// Prevent authenticated users from seeing Login/Register
const GuestRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (currentUser) {
    if (currentUser.role === 'STUDENT') return <Navigate to="/dashboard/student" replace />;
    if (currentUser.role === 'ORGANIZER') return <Navigate to="/dashboard/organizer" replace />;
    if (currentUser.role === 'ADMIN') return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/events" element={<EventsList />} />
            <Route path="/events/:id" element={<EventDetail />} />

            {/* Guest Routes */}
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

            {/* Protected Student Routes */}
            <Route
              path="/dashboard/student"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Organizer Routes */}
            <Route
              path="/dashboard/organizer"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER']}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/create"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
