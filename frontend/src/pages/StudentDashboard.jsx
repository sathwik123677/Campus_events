import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService, attendanceService } from '../services/api';
import Header from '../components/Header';
import ParticleBackground from '../components/ParticleBackground';
import './Dashboard.css';

export default function StudentDashboard() {
  const { currentUser, updateProfile } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tab states
  const [activeTab, setActiveTab] = useState('events');
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Modal for QR code viewing
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setNameInput(currentUser.name);
    }
  }, [currentUser]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const events = await eventService.getMyEvents();
        const history = await attendanceService.getUserAttendanceHistory();
        setRegisteredEvents(events || []);
        setAttendanceHistory(history || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const getAttendanceStats = () => {
    const totalRegistered = registeredEvents.length;
    const totalAttended = registeredEvents.filter(e => e.participantStatus === 'ATTENDED').length;
    const attendanceRate = totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0;
    
    return {
      totalRegistered,
      totalAttended,
      attendanceRate
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setMessage('Name cannot be empty!');
      setMessageType('error');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      await updateProfile({ name: nameInput.trim() });
      setMessage('Name updated successfully!');
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Failed to update name');
      setMessageType('error');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const { totalRegistered, totalAttended, attendanceRate } = getAttendanceStats();

  if (loading) {
    return (
      <>
        <ParticleBackground />
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <ParticleBackground />
      <Header />

      <main className="container dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1>Student Dashboard</h1>
            <p>Welcome back, {currentUser?.name} | {currentUser?.college || 'NIT Patna'}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-box-icon">📅</span>
            <div>
              <h3>Events Registered</h3>
              <p className="stat-number">{totalRegistered}</p>
            </div>
          </div>

          <div className="stat-box">
            <span className="stat-box-icon">✓</span>
            <div>
              <h3>Events Attended</h3>
              <p className="stat-number">{totalAttended}</p>
            </div>
          </div>

          <div className="stat-box">
            <span className="stat-box-icon">📈</span>
            <div>
              <h3>Attendance Rate</h3>
              <p className="stat-number">{attendanceRate}%</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`dashboard-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            My Events
          </button>
          <button 
            className={`dashboard-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {activeTab === 'settings' ? (
          <div className="settings-section">
            <h2>Profile Settings</h2>
            {message && (
              <div className={`alert-message ${messageType}`} style={{ marginBottom: '1.5rem' }}>
                {message}
              </div>
            )}
            <form onSubmit={handleSaveName} className="settings-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  disabled={saving}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <button type="submit" className="btn-save-settings" disabled={saving}>
                {saving ? 'Saving...' : 'Save Name'}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Registered Events */}
            <div className="dashboard-section">
              <h2>Your Registered Events</h2>
              {registeredEvents.length === 0 ? (
                <div className="empty-box">
                  <p>You have not registered for any events yet.</p>
                  <Link to="/events" className="btn btn-primary">Find Events</Link>
                </div>
              ) : (
                <div className="dashboard-events-list">
                  {registeredEvents.map(event => (
                    <div key={event._id} className="dashboard-event-card">
                      <div className="dashboard-event-details">
                        <h3>{event.title}</h3>
                        <p className="event-info">📅 {formatDate(event.date)} | 📍 {event.location}</p>
                        <span className="event-badge" data-status={event.status}>{event.status}</span>
                      </div>
                      <div className="dashboard-event-actions">
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="btn-action qr-btn"
                        >
                          View QR Code
                        </button>
                        <Link to={`/events/${event._id}`} className="btn-action details-btn">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attendance History */}
            <div className="dashboard-section">
              <h2>Attendance Log & History</h2>
               {registeredEvents.length === 0 ? (
                <p className="no-history">No history records found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Event</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Registration Date</th>
                        <th>Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registeredEvents.map(event => (
                        <tr key={event._id}>
                          <td>
                            <Link to={`/events/${event._id}`} className="event-table-link">
                              {event.title}
                            </Link>
                          </td>
                          <td>{formatDate(event.date)}</td>
                          <td>{event.location}</td>
                          <td>{formatDate(event.registeredAt)}</td>
                          <td>
                            <span className={`status-badge ${event.participantStatus}`}>
                              {event.participantStatus === 'REGISTERED' ? 'REGISTERED' : 'ATTENDED'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* QR Modal */}
        {selectedEvent && (
          <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedEvent(null)}>×</button>
              <h2>{selectedEvent.title}</h2>
              <p>Show this code to the organizer to mark your attendance</p>
              <div className="qr-modal-image">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    JSON.stringify({ eventId: selectedEvent._id, eventTitle: selectedEvent.title })
                  )}`}
                  alt="QR Code"
                />
              </div>
              <p className="qr-hint">Event Date: {formatDate(selectedEvent.date)}</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
