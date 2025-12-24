const User = require('../models/User');
const Event = require('../models/Event');
const EventParticipant = require('../models/EventParticipant');
const AttendanceLog = require('../models/AttendanceLog');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalParticipants = await EventParticipant.countDocuments();
    const totalAttendance = await AttendanceLog.countDocuments();

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    const eventsByCategory = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    const eventsByStatus = await Event.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const recentUsers = await User.find()
      .select('name email role college createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const upcomingEvents = await Event.find({ status: 'UPCOMING' })
      .populate('organizer', 'name email')
      .sort({ date: 1 })
      .limit(5);

    const popularEvents = await Event.find()
      .sort({ participantCount: -1 })
      .populate('organizer', 'name email')
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalEvents,
        totalParticipants,
        totalAttendance,
      },
      usersByRole,
      eventsByCategory,
      eventsByStatus,
      recentUsers,
      upcomingEvents,
      popularEvents,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendanceTrends = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const attendanceTrends = await AttendanceLog.aggregate([
      {
        $match: {
          markedAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$markedAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const registrationTrends = await EventParticipant.aggregate([
      {
        $match: {
          registeredAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$registeredAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      attendanceTrends,
      registrationTrends,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventAnalytics = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate(
      'organizer',
      'name email'
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (
      event.organizer._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to view analytics' });
    }

    const totalParticipants = await EventParticipant.countDocuments({
      event: event._id,
    });

    const totalAttendance = await AttendanceLog.countDocuments({
      event: event._id,
    });

    const participantsByStatus = await EventParticipant.aggregate([
      {
        $match: { event: event._id },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const attendanceRate =
      totalParticipants > 0
        ? ((totalAttendance / totalParticipants) * 100).toFixed(2)
        : 0;

    res.json({
      event: {
        _id: event._id,
        title: event.title,
        date: event.date,
        location: event.location,
        organizer: event.organizer,
      },
      totalParticipants,
      totalAttendance,
      attendanceRate: `${attendanceRate}%`,
      participantsByStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportData = async (req, res) => {
  try {
    const { type } = req.params;

    let data;

    switch (type) {
      case 'users':
        data = await User.find().select('-password').lean();
        break;
      case 'events':
        data = await Event.find().populate('organizer', 'name email').lean();
        break;
      case 'attendance':
        data = await AttendanceLog.find()
          .populate('user', 'name email')
          .populate('event', 'title date')
          .lean();
        break;
      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
