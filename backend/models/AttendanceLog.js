const mongoose = require('mongoose');

const attendanceLogSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EventParticipant',
      required: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    markedAt: {
      type: Date,
      default: Date.now,
    },
    method: {
      type: String,
      enum: ['QR_SCAN', 'MANUAL'],
      default: 'QR_SCAN',
    },
  },
  {
    timestamps: true,
  }
);

attendanceLogSchema.index({ event: 1, user: 1 }, { unique: true });
attendanceLogSchema.index({ event: 1 });
attendanceLogSchema.index({ user: 1 });

module.exports = mongoose.model('AttendanceLog', attendanceLogSchema);
