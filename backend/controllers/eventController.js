const Event = require('../models/Event');
const EventParticipant = require('../models/EventParticipant');
const QRCode = require('qrcode');

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      location,
      college,
      maxParticipants,
      registrationDeadline,
      banner,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      location,
      college,
      organizer: req.user._id,
      maxParticipants,
      registrationDeadline,
      banner,
    });

    const qrData = JSON.stringify({
      eventId: event._id,
      eventTitle: event.title,
    });

    const qrCode = await QRCode.toDataURL(qrData);
    event.qrCode = qrCode;
    await event.save();

    const populatedEvent = await Event.findById(event._id).populate(
      'organizer',
      'name email college'
    );

    res.status(201).json(populatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const { category, college, status, search, page = 1, limit = 12 } = req.query;

    const query = {};

    if (category) query.category = category;
    if (college) query.college = college;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email college')
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalEvents: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'organizer',
      'name email college avatar'
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    let isParticipant = false;
    if (req.user) {
      const participant = await EventParticipant.findOne({
        event: event._id,
        user: req.user._id,
      });
      isParticipant = !!participant;
    }

    res.json({ ...event.toObject(), isParticipant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('organizer', 'name email college');

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this event' });
    }

    await EventParticipant.deleteMany({ event: event._id });
    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const existingParticipant = await EventParticipant.findOne({
      event: event._id,
      user: req.user._id,
    });

    if (existingParticipant) {
      return res
        .status(400)
        .json({ message: 'Already registered for this event' });
    }

    if (
      event.maxParticipants &&
      event.participantCount >= event.maxParticipants
    ) {
      return res.status(400).json({ message: 'Event is full' });
    }

    const participant = await EventParticipant.create({
      event: event._id,
      user: req.user._id,
    });

    event.participantCount += 1;
    await event.save();

    req.io.to(`event-${event._id}`).emit('participantCountUpdate', {
      eventId: event._id,
      count: event.participantCount,
    });

    res.status(201).json(participant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.leaveEvent = async (req, res) => {
  try {
    const participant = await EventParticipant.findOne({
      event: req.params.id,
      user: req.user._id,
    });

    if (!participant) {
      return res.status(404).json({ message: 'Not registered for this event' });
    }

    await EventParticipant.findByIdAndDelete(participant._id);

    const event = await Event.findById(req.params.id);
    if (event) {
      event.participantCount = Math.max(0, event.participantCount - 1);
      await event.save();

      req.io.to(`event-${event._id}`).emit('participantCountUpdate', {
        eventId: event._id,
        count: event.participantCount,
      });
    }

    res.json({ message: 'Left event successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to view participants' });
    }

    const participants = await EventParticipant.find({ event: event._id })
      .populate('user', 'name email college department avatar')
      .sort({ registeredAt: -1 });

    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const participants = await EventParticipant.find({ user: req.user._id })
      .populate({
        path: 'event',
        populate: { path: 'organizer', select: 'name email' },
      })
      .sort({ registeredAt: -1 });

    const events = participants
      .map((p) => ({
        ...p.event.toObject(),
        participantStatus: p.status,
        registeredAt: p.registeredAt,
      }))
      .filter((e) => e._id);

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrganizedEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({
      date: -1,
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
