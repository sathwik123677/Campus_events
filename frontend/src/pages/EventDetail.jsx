import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService, attendanceService } from '../services/api';
import { socketService } from '../services/socket';
import Header from '../components/Header';
import ParticleBackground from '../components/ParticleBackground';
import './EventDetail.css';

export default function EventDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Organizer Panel State
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const loadEvent = async () => {
    try {
      const data = await eventService.getEventById(id);
      setEvent(data);
      if (currentUser && (currentUser.role === 'ADMIN' || currentUser._id === data.organizer?._id)) {
        loadParticipants();
      }
    } catch (err) {
      setError(err.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const loadParticipants = async () => {
    setLoadingParticipants(true);
    try {
      const data = await eventService.getEventParticipants(id);
      setParticipants(data || []);
    } catch (err) {
      console.error('Failed to load participants:', err);
    } finally {
      setLoadingParticipants(false);
    }
  };

  useEffect(() => {
    loadEvent();

    // Setup Socket
    socketService.connect();
    socketService.joinEvent(id);

    const removeCountSub = socketService.onParticipantCountUpdate((data) => {
      if (data.eventId === id) {
        setEvent(prev => {
          if (!prev) return null;
          return {
            ...prev,
            participantCount: data.count
          };
        });
      }
    });

    const removeAttendanceSub = socketService.onAttendanceUpdate((data) => {
      if (data.eventId === id) {
        setEvent(prev => {
          if (!prev) return null;
          return {
            ...prev,
            attendanceCount: data.attendanceCount || data.count
          };
        });
        
        // If organizer list is visible, update attendee status
        setParticipants(prev => 
          prev.map(p => p.user._id === data.userId ? { ...p, status: 'ATTENDED' } : p)
        );
      }
    });

    return () => {
      socketService.leaveEvent(id);
      removeCountSub();
      removeAttendanceSub();
      socketService.disconnect();
    };
  }, [id, currentUser]);

  const handleJoin = async () => {
    setActionLoading(true);
    setMessage('');
    try {
      await eventService.joinEvent(id);
      setEvent(prev => ({ ...prev, isParticipant: true, participantCount: (Number(prev.participantCount) || 0) + 1 }));
      setMessage('Successfully registered for event! QR Code generated.');
      setMessageType('success');
    } catch (err) {
      setMessage(err.message || 'Failed to register');
      setMessageType('error');
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleLeave = async () => {
    setActionLoading(true);
    setMessage('');
    try {
      await eventService.leaveEvent(id);
      setEvent(prev => ({ ...prev, isParticipant: false, participantCount: Math.max(0, (Number(prev.participantCount) || 0) - 1) }));
      setMessage('Successfully left the event.');
      setMessageType('success');
    } catch (err) {
      setMessage(err.message || 'Failed to leave event');
      setMessageType('error');
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleMarkAttendance = async (participant) => {
    setActionLoading(true);
    setMessage('');
    try {
      await attendanceService.markAttendance(id, participant.user._id);
      setParticipants(prev => 
        prev.map(p => p.user._id === participant.user._id ? { ...p, status: 'ATTENDED' } : p)
      );
      setEvent(prev => ({ ...prev, attendanceCount: (Number(prev.attendanceCount) || 0) + 1 }));
      setMessage(`Attendance marked successfully for ${participant.user?.name}`);
      setMessageType('success');
    } catch (err) {
      setMessage(err.message || 'Failed to mark attendance');
      setMessageType('error');
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const isDefaultAvatar = (url) => {
    return !url || url.includes('via.placeholder.com');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <ParticleBackground />
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading event details...</p>
        </div>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <ParticleBackground />
        <Header />
        <div className="container error-container">
          <h2>Error</h2>
          <p>{error || 'Event not found'}</p>
          <Link to="/events" className="btn btn-primary">Back to Events</Link>
        </div>
      </>
    );
  }

  const isOrganizer = currentUser && currentUser._id === event.organizer?._id;
  const isAdmin = currentUser && currentUser.role === 'ADMIN';
  const showManagePanel = isOrganizer || isAdmin;

  // Render QR Code content
  const qrData = JSON.stringify({ eventId: event._id, eventTitle: event.title });
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}`;

  return (
    <>
      <ParticleBackground />
      <Header />

      <main className="container event-detail-page">
        <div className="back-link">
          <Link to="/events">← Back to Events</Link>
        </div>

        {message && (
          <div className={`alert-message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="event-layout">
          <div className="event-main">
            <div className="event-header-section">
              <span className="detail-category">{event.category}</span>
              <h1>{event.title}</h1>
              <div className="event-meta-info">
                <span>📅 {formatDate(event.date)}</span>
                <span>📍 {event.location}</span>
              </div>
            </div>

            {event.banner && (
              <div className="event-detail-image">
                <img src={event.banner} alt={event.title} />
              </div>
            )}

            <div className="event-description-section">
              <h2>About Event</h2>
              <p>{event.description}</p>
            </div>

            <div className="organizer-section">
              <h2>Organizer Details</h2>
              <div className="organizer-card">
                {isDefaultAvatar(event.organizer?.avatar) ? (
                  <div className="organizer-avatar-initials">
                    {getInitials(event.organizer?.name)}
                  </div>
                ) : (
                  <img src={event.organizer?.avatar} alt={event.organizer?.name} className="organizer-avatar" />
                )}
                <div>
                  <div className="organizer-name">{event.organizer?.name}</div>
                  <div className="organizer-college">{event.organizer?.college}</div>
                  <div className="organizer-email">{event.organizer?.email}</div>
                </div>
              </div>
            </div>

            {showManagePanel && (
              <div className="manage-section">
                <div className="manage-header">
                  <h2>Manage Participants & Attendance</h2>
                  <button onClick={loadParticipants} className="btn-refresh" disabled={loadingParticipants}>
                    🔄 Refresh
                  </button>
                </div>

                {loadingParticipants ? (
                  <div className="loading-inline">
                    <div className="spinner-small"></div>
                    <span>Refreshing...</span>
                  </div>
                ) : (
                  <>
                    {participants.length === 0 ? (
                      <p className="no-participants">No participants registered yet.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="participants-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>College</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {participants.map(p => (
                              <tr key={p.user._id}>
                                <td>{p.user.name}</td>
                                <td>{p.user.email}</td>
                                <td>{p.user.college}</td>
                                <td>
                                  <span className={`status-badge ${p.status}`}>
                                    {p.status}
                                  </span>
                                </td>
                                <td>
                                  {p.status === 'REGISTERED' ? (
                                    <button
                                      onClick={() => handleMarkAttendance(p)}
                                      disabled={actionLoading}
                                      className="btn-mark"
                                    >
                                      Mark Attended
                                    </button>
                                  ) : (
                                    <span className="attended-check">✓ Attended</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <aside className="event-sidebar">
            <div className="sidebar-card stats-card">
              <h3>Event Statistics</h3>
              <div className="stat-item">
                <span className="stat-label">Capacity</span>
                <span className="stat-value">{event.maxParticipants || 'Unlimited'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Registered</span>
                <span className="stat-value">
                  {showManagePanel ? participants.length : (Number(event.participantCount) || 0)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Attended</span>
                <span className="stat-value">
                  {showManagePanel
                    ? participants.filter(p => p.status === 'ATTENDED').length
                    : (Number(event.attendanceCount) || 0)}
                </span>
              </div>
            </div>

            {currentUser && !showManagePanel && (
              <div className="sidebar-card action-card">
                <h3>Your Registration</h3>
                
                {event.isParticipant ? (
                  <div className="joined-actions">
                    <div className="qr-container">
                      <h4>Your Attendance QR Code</h4>
                      <img src={qrUrl} alt="Attendance QR Code" className="qr-image" />
                      <p>Show this code to the event organizer at the venue to check-in.</p>
                    </div>
                    <button
                      onClick={handleLeave}
                      disabled={actionLoading}
                      className="btn-leave"
                    >
                      Leave Event
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleJoin}
                    disabled={actionLoading || event.participantCount >= event.maxParticipants}
                    className="btn-join"
                  >
                    {event.participantCount >= event.maxParticipants ? 'Event Full' : 'Register / Join Event'}
                  </button>
                )}
              </div>
            )}

            {showManagePanel && (
              <div className="sidebar-card organizer-badge-card">
                <div className="organizer-badge-icon">👑</div>
                <h3>Event Host</h3>
                <p>You are managing this event. View registrations and mark attendance live.</p>
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
