const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAttendanceTrends,
  getEventAnalytics,
  exportData,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('ADMIN'), getDashboardStats);
router.get('/trends', protect, authorize('ADMIN'), getAttendanceTrends);
router.get('/event/:eventId', protect, authorize('ORGANIZER', 'ADMIN'), getEventAnalytics);
router.get('/export/:type', protect, authorize('ADMIN'), exportData);

module.exports = router;
