const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getEventAttendance,
  getUserAttendanceHistory,
  verifyQRCode,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.post('/mark', protect, authorize('ORGANIZER', 'ADMIN'), markAttendance);
router.get('/event/:eventId', protect, authorize('ORGANIZER', 'ADMIN'), getEventAttendance);
router.get('/my-history', protect, getUserAttendanceHistory);
router.post('/verify-qr', protect, verifyQRCode);

module.exports = router;
