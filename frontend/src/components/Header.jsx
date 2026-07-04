import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatName = (str) => {
    if (!str) return '';
    return str.split(' ').map(word => {
      if (word.toLowerCase() === 'nit') return 'NIT';
      if (word.toLowerCase() === 'iit') return 'IIT';
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  };

  const isDefaultAvatar = (url) => {
    return !url || url.includes('via.placeholder.com');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <img src="/logo.png" alt="CampusEvents Logo" style={{ height: '32px', width: '32px', borderRadius: '6px', objectFit: 'cover' }} />
            <span className="logo-text">CampusEvents</span>
          </Link>

          <nav className={`nav ${mobileMenuOpen ? 'active' : ''}`}>
            <NavLink to="/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Discover
            </NavLink>

            {currentUser ? (
              <>
                {currentUser.role === 'STUDENT' && (
                  <NavLink to="/dashboard/student" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    My Dashboard
                  </NavLink>
                )}

                {currentUser.role === 'ORGANIZER' && (
                  <NavLink to="/dashboard/organizer" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Organizer
                  </NavLink>
                )}

                {currentUser.role === 'ADMIN' && (
                  <NavLink to="/dashboard/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Admin
                  </NavLink>
                )}

                <div className="user-menu">
                  <div className="user-info">
                    {isDefaultAvatar(currentUser.avatar) ? (
                      <div className="avatar-initials">
                        {getInitials(currentUser.name)}
                      </div>
                    ) : (
                      <img src={currentUser.avatar} alt="Avatar" className="avatar" />
                    )}
                    <span className="user-name">{formatName(currentUser.name)}</span>
                  </div>
                  <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Login
                </NavLink>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </>
            )}

            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            </button>
          </nav>

          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
