import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/api';
import Header from '../components/Header';
import ParticleBackground from '../components/ParticleBackground';
import './CreateEvent.css';

export default function CreateEvent() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    registrationDeadline: '',
    startTime: '',
    endTime: '',
    location: '',
    category: 'Technical',
    capacity: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? (value === '' ? '' : parseInt(value, 10) || 0) : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image file is too large! Please choose an image under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        image: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Pre-fill a beautiful default background image matching the category if empty
    let eventImage = formData.image;
    if (!eventImage) {
      if (formData.category === 'Technical') {
        eventImage = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800';
      } else if (formData.category === 'Cultural') {
        eventImage = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800';
      } else if (formData.category === 'Workshop') {
        eventImage = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800';
      } else {
        eventImage = 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800';
      }
    }

    try {
      await eventService.createEvent({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        registrationDeadline: formData.registrationDeadline || null,
        startTime: formData.startTime || '10:00 AM',
        endTime: formData.endTime || '04:00 PM',
        location: formData.location,
        category: formData.category,
        maxParticipants: formData.capacity ? parseInt(formData.capacity, 10) : null,
        banner: eventImage,
        college: currentUser?.college || 'NIT Patna'
      });
      navigate('/dashboard/organizer');
    } catch (err) {
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ParticleBackground />
      <Header />

      <main className="container create-event-page">
        <div className="create-card">
          <div className="create-header">
            <h1>+ Create New Event</h1>
            <p>Schedule a new campus activity and manage attendance</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="create-form">
            <div className="form-group">
              <label htmlFor="title">Event Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Annual Hackathon 2026"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe what your event is about, guidelines, timeline, rules..."
                rows="5"
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Event Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="registrationDeadline">Last Date of Registering</label>
                <input
                  type="date"
                  id="registrationDeadline"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location / Venue</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Block A Seminar Hall"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Capacity (Seats/Participants)</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="5"
                  placeholder="e.g. 100"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Sports">Sports</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Conference">Conference</option>
                  <option value="Social">Social</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Banner Image (Optional)</label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    id="image-file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={loading}
                    className="file-upload-input"
                  />
                  <div className="file-upload-trigger">
                    {formData.image ? (
                      <div className="preview-container">
                        <img src={formData.image} alt="Preview" className="upload-preview" />
                        <span className="change-photo-text">Change Photo</span>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <span className="upload-icon">📁</span>
                        <span>Click to Upload Image from Device</span>
                        <span className="upload-hint">Supports PNG, JPG (Max 2MB)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="create-actions">
              <Link to="/dashboard/organizer" className="btn-cancel">
                Cancel
              </Link>
              <button type="submit" className="btn-submit-event" disabled={loading}>
                {loading ? 'Creating event...' : 'Publish Event'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
