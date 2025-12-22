# Campus Event Management System

A complete, production-grade event management platform built with the MEAN stack (MongoDB, Express.js, Angular, Node.js).

## Features

### User Features
- **Authentication**: Secure JWT-based authentication with role-based access control (Student, Organizer, Admin)
- **Event Discovery**: Browse and filter events by category, college, and status
- **Event Registration**: Join/leave events with real-time participant count updates
- **QR Code Attendance**: Unique QR codes for each event for instant attendance tracking
- **Personal Dashboard**: View registered events and attendance history

### Organizer Features
- **Event Management**: Create, edit, and delete events
- **Participant Tracking**: View all registered participants
- **Attendance Management**: Scan QR codes to mark attendance
- **Event Analytics**: Track participant and attendance metrics

### Admin Features
- **Analytics Dashboard**: Platform-wide statistics and insights
- **User Management**: View all users by role
- **Event Overview**: Monitor all events and their performance
- **Data Export**: Export users, events, and attendance data

### UI/UX Features
- **Dark/Light Theme**: Smooth animated theme toggle with localStorage persistence
- **Animated Particle Background**: Premium Three.js particle effects with mouse parallax
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
- Rate limiting and security middleware

### Frontend
- Angular 21 (Standalone Components)
- RxJS for reactive programming
- Three.js for particle animations
- Socket.io-client for real-time updates
- TypeScript

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
# For macOS
brew services start mongodb-community

# For Linux
sudo systemctl start mongod

# For Windows
# Start MongoDB service from Services panel
```

3. **Configure environment variables**

The `.env` file is already set up with default values. Update if needed:
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
npm start
```
The frontend will run on `http://localhost:4200`

### Run Both Concurrently
```bash
npm run dev
```

## Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

## Project Structure

```
campus-event-management/
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # Mongoose models
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── server.js        # Express server entry point
├── src/
│   ├── app/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # Angular services
│   │   ├── guards/      # Route guards
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── global_styles.css
│   ├── index.html
│   └── main.ts
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

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
- **STUDENT**: Can browse and join events
- **ORGANIZER**: Can create and manage events
- **ADMIN**: Full access to analytics and platform management

## Theme System

The application supports both dark and light themes:
- **Dark Mode** (default): Deep black backgrounds with gold accents
- **Light Mode**: Clean white backgrounds with gold accents

Theme preference is saved in localStorage and persists across sessions.

## Real-time Features

Socket.io provides real-time updates for:
- Live participant count updates when users join/leave events
- Real-time attendance count updates
- Instant dashboard metric updates for admins

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Rate limiting on API endpoints
- Input validation
- Protected routes
- Secure HTTP headers

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is a demonstration project built to showcase full-stack development capabilities.

## License

MIT License
