const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  user: {
    name: String,
    email: String,
    phone: String
  },
  service: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Booking', bookingSchema);