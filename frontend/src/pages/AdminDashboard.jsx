import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../services/api';
import Header from '../components/Header';
import ParticleBackground from '../components/ParticleBackground';
import './Dashboard.css';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await analyticsService.getDashboardStats();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <ParticleBackground />
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading platform analytics...</p>
        </div>
      </>
    );
  }

  const { stats, usersByRole, eventsByCategory, eventsByStatus, popularEvents, recentUsers } = dashboardData || {};

  return (
    <>
      <ParticleBackground />
      <Header />

      <main className="container dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Overview of platform analytics and metrics</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-box-icon">👥</span>
            <div>
              <h3>Total Users</h3>
              <p className="stat-number">{stats?.totalUsers || 0}</p>
            </div>
          </div>

          <div className="stat-box">
            <span className="stat-box-icon">🎪</span>
            <div>
              <h3>Total Events</h3>
              <p className="stat-number">{stats?.totalEvents || 0}</p>
            </div>
          </div>

          <div className="stat-box">
            <span className="stat-box-icon">📝</span>
            <div>
              <h3>Total Registrations</h3>
              <p className="stat-number">{stats?.totalParticipants || 0}</p>
            </div>
          </div>

          <div className="stat-box">
            <span className="stat-box-icon">✅</span>
            <div>
              <h3>Total Attendance</h3>
              <p className="stat-number">{stats?.totalAttendance || 0}</p>
            </div>
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="dashboard-grid">
          {/* Users by Role */}
          <div className="chart-card">
            <h3>Users by Role</h3>
            <div className="chart-items">
              {usersByRole?.map(item => (
                <div key={item._id} className="chart-item">
                  <div className="chart-label">{item._id}</div>
                  <div className="chart-bar">
                    <div
                      className="chart-fill"
                      style={{ width: `${stats?.totalUsers > 0 ? (item.count / stats.totalUsers) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="chart-value">{item.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Events by Category */}
          <div className="chart-card">
            <h3>Events by Category</h3>
            <div className="chart-items">
              {eventsByCategory?.map(item => (
                <div key={item._id} className="chart-item">
                  <div className="chart-label">{item._id}</div>
                  <div className="chart-bar">
                    <div
                      className="chart-fill"
                      style={{ width: `${stats?.totalEvents > 0 ? (item.count / stats.totalEvents) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="chart-value">{item.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Events by Status */}
          <div className="chart-card">
            <h3>Events by Status</h3>
            <div className="chart-items">
              {eventsByStatus?.map(item => (
                <div key={item._id} className="chart-item">
                  <div className="chart-label">{item._id}</div>
                  <div className="chart-bar">
                    <div
                      className="chart-fill"
                      style={{ width: `${stats?.totalEvents > 0 ? (item.count / stats.totalEvents) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="chart-value">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Events */}
        <div className="dashboard-section">
          <h2>Popular Events</h2>
          {popularEvents?.length === 0 ? (
            <p className="no-records">No events registered yet.</p>
          ) : (
            <div className="records-list">
              {popularEvents?.map(event => (
                <div key={event._id} className="record-item">
                  <div className="record-details">
                    <h3>{event.title}</h3>
                    <p className="record-info">{event.category} • Organized by {event.organizer?.name}</p>
                  </div>
                  <div className="record-stats">
                    <span>👥 {event.participantCount} registered</span>
                    <span>✅ {event.attendanceCount} attended</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="dashboard-section">
          <h2>Recent Users</h2>
          {recentUsers?.length === 0 ? (
            <p className="no-records">No recent users found.</p>
          ) : (
            <div className="records-list">
              {recentUsers?.map(user => (
                <div key={user._id} className="record-item">
                  <div className="record-details">
                    <h3>{user.name}</h3>
                    <p className="record-info">{user.email} • {user.college}</p>
                  </div>
                  <div className="record-badge-container">
                    <span className={`user-role-badge role-${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
