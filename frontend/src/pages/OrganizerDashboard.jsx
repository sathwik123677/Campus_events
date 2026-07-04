import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/api';
import Header from '../components/Header';
import ParticleBackground from '../components/ParticleBackground';
import './Dashboard.css';

export default function OrganizerDashboard() {
  const { currentUser, updateProfile } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Tab states
  const [activeTab, setActiveTab] = useState('events');
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [saving, setSaving] = useState(false);

  const loadOrganizerEvents = async () => {
    try {
      const data = await eventService.getOrganizedEvents();
      setEvents(data || []);
    } catch (err) {
      console.error('Failed to load organized events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setNameInput(currentUser.name);
    }
  }, [currentUser]);

  useEffect(() => {
    loadOrganizerEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    setActionLoading(true);
    try {
      await eventService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e._id !== id));
      setMessage('Event deleted successfully.');
      setMessageType('success');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (err) {
      alert(err.message || 'Failed to delete event');
    } finally {
      setActionLoading(false);
    }
  };

  const getStats = () => {
    const totalCreated = events.length;
    const totalRegistrations = events.reduce((acc, curr) => acc + (curr.participantCount || 0), 0);
    const totalAttendance = events.reduce((acc, curr) => acc + (curr.attendanceCount || 0), 0);

    return {
      totalCreated,
      totalRegistrations,
      totalAttendance
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatName = (str) => {
    if (!str) return '';
    return str.split(' ').map(word => {
      if (word.toLowerCase() === 'nit') return 'NIT';
      if (word.toLowerCase() === 'iit') return 'IIT';
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
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
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  const { totalCreated, totalRegistrations, totalAttendance } = getStats();

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
        <div className="dashboard-header organizer-header">
          <div>
            <h1>Organizer Dashboard</h1>
            <p>Welcome back, Host {formatName(currentUser?.name)} | {formatName(currentUser?.college) || 'NIT Patna'}</p>
          </div>
          <Link to="/events/create" className="btn btn-primary btn-create">
            + Create Event
          </Link>
        </div>

        {message && activeTab !== 'settings' && (
          <div className={`alert-message ${messageType || 'success'}`}>{message}</div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-box-icon">🎪</span>
            <div>
              <h3>Events Created</h3>
              <p className="stat-number">{totalCreated}</p>
            </div>
          </div>

          <div className="stat-box">
            <span className="stat-box-icon">👥</span>
            <div>
              <h3>Total Registered</h3>
              <p className="stat-number">{totalRegistrations}</p>
            </div>
          </div>

          <div className="stat-box">
            <span className="stat-box-icon">✓</span>
            <div>
              <h3>Total Attendance</h3>
              <p className="stat-number">{totalAttendance}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`dashboard-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Manage Events
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
          <div className="dashboard-section">
            <h2>Your Managed Events</h2>
            {events.length === 0 ? (
              <div className="empty-box">
                <p>You have not created any events yet.</p>
                <Link to="/events/create" className="btn btn-primary">Create Your First Event</Link>
              </div>
            ) : (
              <div className="dashboard-events-list">
                {events.map(event => (
                  <div key={event._id} className="dashboard-event-card organizer-event-card">
                    <div className="dashboard-event-details">
                      <h3>{event.title}</h3>
                      <p className="event-info">📅 {formatDate(event.date)} | 📍 {event.location}</p>
                      <div className="organizer-stats-summary">
                        <span>Capacity: <strong>{event.maxParticipants || 'Unlimited'}</strong></span>
                        <span>Registrations: <strong>{event.participantCount || 0}</strong></span>
                        <span>Attended: <strong>{event.attendanceCount || 0}</strong></span>
                      </div>
                    </div>
                    <div className="dashboard-event-actions">
                      <Link to={`/events/${event._id}`} className="btn-action details-btn">
                        Manage Attendance
                      </Link>
                      <button
                        onClick={() => handleDelete(event._id)}
                        disabled={actionLoading}
                        className="btn-action delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
