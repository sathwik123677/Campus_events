const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  getEventParticipants,
  getMyEvents,
  getOrganizedEvents,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getAllEvents)
  .post(protect, authorize('ORGANIZER', 'ADMIN'), createEvent);

router.get('/my-events', protect, getMyEvents);
router.get('/organized', protect, authorize('ORGANIZER', 'ADMIN'), getOrganizedEvents);

router
  .route('/:id')
  .get(protect, getEventById)
  .put(protect, authorize('ORGANIZER', 'ADMIN'), updateEvent)
  .delete(protect, authorize('ORGANIZER', 'ADMIN'), deleteEvent);

router.post('/:id/join', protect, joinEvent);
router.delete('/:id/leave', protect, leaveEvent);
router.get('/:id/participants', protect, authorize('ORGANIZER', 'ADMIN'), getEventParticipants);

module.exports = router;
