# Campus Event Management System

A complete, production-grade event management platform built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Live Deployments

- **Frontend**: [https://campus-events-mu.vercel.app](https://campus-events-mu.vercel.app)
- **Backend API**: [https://campus-events-backend-ie78.onrender.com](https://campus-events-backend-ie78.onrender.com)

## Features

### User Features
- **Authentication**: Secure JWT-based authentication with role-based access control (Student, Organizer, Admin)
- **Event Discovery**: Browse and filter events by category, college, and status
- **Event Registration**: Join/leave events with real-time participant count updates
- **QR Code Attendance**: Unique QR codes for each event for instant attendance tracking
- **Personal Dashboard**: View registered events and attendance history
- **Profile Settings**: Quick and easy profile edit settings tab to change/update Full Name instantly

### Organizer Features
- **Event Creation & Management**: Create events with Title, Description, Date, Times, Location, Category, Capacity, Banner, and **Last Date of Registering** (Registration Deadline)
- **Participant Tracking**: View all registered participants
- **Attendance Management**: Scan QR codes or check-in students manually to mark attendance
- **Event Analytics**: Track participant and attendance metrics

### Admin Features
- **Analytics Dashboard**: Platform-wide statistics and insights
- **User Management**: View all users by role
- **Event Overview**: Monitor all events and their performance
- **Data Export**: Export users, events, and attendance data

### UI/UX Features
- **Dark/Light Theme**: Smooth animated theme toggle with localStorage persistence
  - *Dark Mode* (default): Deep black backgrounds with premium gold accents
  - *Light Mode*: Cool-toned Slate background with elegant gold branding and clean layouts
- **Animated Particle Background**: Premium Three.js particle effects with mouse parallax
  - Cool-toned stardust floating gold and silver particles in Light Mode
  - Additive glowing golden stardust in Dark Mode
- **Responsive Design**: Perfect experience on mobile, tablet, and desktop
- **Real-time Updates**: Live participant counts and attendance updates via Socket.io
- **Glassmorphism Design**: Modern, premium UI with gold accents

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.io for real-time features
- QR Code generation
- Environment-aware rate limiting (relaxed limit of 10,000 requests locally in development, secure limit of 100 in production)

### Frontend
- React (Vite-powered environment)
- React Router DOM for routing
- React Context API for State & Theme Management
- Three.js for 3D particle animations
- Socket.io-client for real-time updates

## Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or higher)
- MongoDB (v6 or higher) installed and running
- npm or yarn package manager

## Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up MongoDB**

Make sure MongoDB is running on your system:
```bash
# For Windows
# Start MongoDB service from Services panel or command line:
net start MongoDB
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/campus-event-management
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
PORT=3000
NODE_ENV=development
```

## Running the Application

### Start Backend Server
```bash
npm run server
```
The backend will run on `http://localhost:3000`

### Start Frontend (in a new terminal)
```bash
npm start --prefix frontend
```
The frontend will run on `http://localhost:5173`

### Run Both Concurrently
```bash
npm run dev
```

## Build for Production

```bash
npm run build
```

The React production bundle will be built in the `frontend/dist/` directory.

## Project Structure

```
Campus-Events/
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # Mongoose models
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── server.js        # Express server entry point
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── assets/      # Local images & assets
│   │   ├── components/  # Reusable React components (Header, ParticleBackground, etc.)
│   │   ├── context/     # AuthContext and ThemeContext
│   │   ├── pages/       # Page components (Dashboards, EventDetails, Auth, CreateEvent, etc.)
│   │   ├── services/    # api.js and socket.js API service wrappers
│   │   ├── App.jsx      # Root routing component
│   │   ├── index.css    # Global stylesheet and theme tokens
│   │   └── main.jsx     # Vite entry point
│   └── vite.config.js   # Vite configuration
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/profile` - Update user name/profile details

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (Organizer/Admin)
- `PUT /api/events/:id` - Update event (Organizer/Admin)
- `DELETE /api/events/:id` - Delete event (Organizer/Admin)
- `POST /api/events/:id/join` - Join event
- `DELETE /api/events/:id/leave` - Leave event
- `GET /api/events/my-events` - Get user's registered events
- `GET /api/events/organized` - Get organized events

### Attendance
- `POST /api/attendance/mark` - Mark attendance (Organizer/Admin)
- `GET /api/attendance/event/:eventId` - Get event attendance
- `GET /api/attendance/my-history` - Get user attendance history
- `POST /api/attendance/verify-qr` - Verify QR code

### Analytics
- `GET /api/analytics/dashboard` - Get admin dashboard stats (Admin)
- `GET /api/analytics/trends` - Get attendance trends (Admin)
- `GET /api/analytics/event/:eventId` - Get event analytics
- `GET /api/analytics/export/:type` - Export data (Admin)

## Default User Roles

After registration, users can have one of three roles:
- **STUDENT**: Can browse and join events, and check-in using their personal QR code
- **ORGANIZER**: Can create events, view registered attendees, and mark check-in attendance
