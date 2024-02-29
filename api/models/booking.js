const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  type: String,
  services: [String],
  start: Date,
  end: Date,
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customer: {
    firstName: String,
    lastName: String,
    email: String
  }
})

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking