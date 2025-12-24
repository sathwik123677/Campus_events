const Event = require('../models/Event');
const EventParticipant = require('../models/EventParticipant');
const AttendanceLog = require('../models/AttendanceLog');

exports.markAttendance = async (req, res) => {
  try {
    const { eventId, userId } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to mark attendance' });
    }

    const participant = await EventParticipant.findOne({
      event: eventId,
      user: userId,
    });

    if (!participant) {
      return res
        .status(404)
        .json({ message: 'User not registered for this event' });
    }

    const existingAttendance = await AttendanceLog.findOne({
      event: eventId,
      user: userId,
    });

    if (existingAttendance) {
      return res
        .status(400)
        .json({ message: 'Attendance already marked for this user' });
    }

    const attendance = await AttendanceLog.create({
      event: eventId,
      user: userId,
      participant: participant._id,
      markedBy: req.user._id,
      method: 'QR_SCAN',
    });

    participant.status = 'ATTENDED';
    await participant.save();

    event.attendanceCount += 1;
    await event.save();

    req.io.to(`event-${eventId}`).emit('attendanceUpdate', {
      eventId: eventId,
      count: event.attendanceCount,
    });

    const populatedAttendance = await AttendanceLog.findById(attendance._id)
      .populate('user', 'name email college')
      .populate('markedBy', 'name');

    res.status(201).json(populatedAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventAttendance = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to view attendance' });
    }

    const attendance = await AttendanceLog.find({ event: req.params.eventId })
      .populate('user', 'name email college department')
      .populate('markedBy', 'name')
      .sort({ markedAt: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserAttendanceHistory = async (req, res) => {
  try {
    const attendance = await AttendanceLog.find({ user: req.user._id })
      .populate({
        path: 'event',
        populate: { path: 'organizer', select: 'name email' },
      })
      .sort({ markedAt: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyQRCode = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Invalid QR code' });
    }

    const participant = await EventParticipant.findOne({
      event: eventId,
      user: req.user._id,
    });

    if (!participant) {
      return res
        .status(404)
        .json({ message: 'Not registered for this event' });
    }

    const existingAttendance = await AttendanceLog.findOne({
      event: eventId,
      user: req.user._id,
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked' });
    }

    res.json({
      valid: true,
      event: {
        _id: event._id,
        title: event.title,
        date: event.date,
        location: event.location,
      },
      participant: {
        _id: participant._id,
        status: participant.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
