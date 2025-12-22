const mongoose = require('mongoose');

const eventParticipantSchema = new mongoose.Schema(
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
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['REGISTERED', 'ATTENDED', 'CANCELLED'],
      default: 'REGISTERED',
    },
  },
  {
    timestamps: true,
  }
);

eventParticipantSchema.index({ event: 1, user: 1 }, { unique: true });
eventParticipantSchema.index({ user: 1 });
eventParticipantSchema.index({ event: 1, status: 1 });

module.exports = mongoose.model('EventParticipant', eventParticipantSchema);
