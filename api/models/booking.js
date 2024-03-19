const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  type: String,
  service: String,
  start: Date,
  end: Date,
  duration: Number,
  price: Number,
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking