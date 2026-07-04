import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/api';
import Header from '../components/Header';
import ParticleBackground from '../components/ParticleBackground';
import './EventsList.css';

export default function EventsList() {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [myEventIds, setMyEventIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getAllEvents({
        ...filters,
        page: currentPage,
        limit: 12
      });
      setEvents(data.events || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [filters, currentPage]);

  useEffect(() => {
    const loadMyEventIds = async () => {
      if (!currentUser) {
        setMyEventIds(new Set());
        return;
      }
      try {
        const myEvents = await eventService.getMyEvents();
        setMyEventIds(new Set(myEvents.map(e => e._id)));
      } catch (err) {
        console.error('Failed to load registered event IDs:', err);
      }
    };
    loadMyEventIds();
  }, [currentUser]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setCurrentPage(1);
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <ParticleBackground />
      <Header />

      <main className="container events-list-page">
        <div className="list-header">
          <h1>Discover Events</h1>
          <p>Find exciting activities, hackathons, and workshops happening on campus</p>
        </div>

        <div className="filters-container">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search events by title or description..."
            className="filter-search"
          />

          <div className="select-filters">
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All Categories</option>
              <option value="TECHNICAL">Technical</option>
              <option value="CULTURAL">Cultural</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="SPORTS">Sports</option>
              <option value="OTHER">Other</option>
            </select>

            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Status</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : (
          <>
            {events.length === 0 ? (
              <div className="no-events">
                <h3>No events found</h3>
                <p>Try resetting your filters or search keywords.</p>
              </div>
            ) : (
              <div className="events-grid">
                {events.map(event => (
                  <div key={event._id} className="event-card">
                    {event.banner && (
                      <div className="event-card-image">
                        <img src={event.banner} alt={event.title} />
                      </div>
                    )}
                    <div className="event-card-content">
                      <div className="event-card-header-row">
                        <span className="event-date">📅 {formatDate(event.date)}</span>
                        <div className="badge-group">
                          <span className="category-badge">{event.category}</span>
                          <span className="status-badge-inline" data-status={event.status}>
                            {event.status}
                          </span>
                          {myEventIds.has(event._id) && (
                            <span className="status-badge-inline registered-badge">✓ Registered</span>
                          )}
                        </div>
                      </div>
                      <h3>{event.title}</h3>
                      <p className="event-description">
                        {event.description.length > 100 
                          ? `${event.description.substring(0, 100)}...`
                          : event.description
                        }
                      </p>

                      <div className="event-card-footer">
                        <div className="organizer-info">
                          {isDefaultAvatar(event.organizer?.avatar) ? (
                            <div className="organizer-avatar-initials">
                              {getInitials(event.organizer?.name)}
                            </div>
                          ) : (
                            <img src={event.organizer?.avatar} alt={event.organizer?.name} className="organizer-avatar" />
                          )}
                          <span>{event.organizer?.name}</span>
                        </div>
                        <Link 
                          to={`/events/${event._id}`} 
                          className={`btn-view ${myEventIds.has(event._id) ? 'registered' : ''}`}
                        >
                          {myEventIds.has(event._id) ? '✓ Registered' : 'View Details'}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn-page"
                >
                  Previous
                </button>
                <span className="page-number">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn-page"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
