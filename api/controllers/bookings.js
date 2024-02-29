const bookingsRouter = require('express').Router()
const Booking = require('../models/booking')

bookingsRouter.get('/', async (request, response) => {
  const bookings = await Booking.find({}).populate('worker', { username: 1, name: 1 })
  response.json(bookings)
})

module.exports = bookingsRouter