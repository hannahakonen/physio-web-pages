const bookingsRouter = require('express').Router()
const Booking = require('../models/booking')
const Worker = require('../models/user')

bookingsRouter.get('/', async (request, response) => {
  const bookings = await Booking.find({}).populate('worker', { username: 1, name: 1 })
  response.json(bookings)
})

bookingsRouter.get('/workers', async (request, response) => {
  const usernames = request.query.usernames.split(',')

  const workers = await Worker.find({ username: { $in: usernames } })
    .populate('bookings') // populate the bookings field

  // map each worker to an object that includes the worker's info and the count of their bookings
  const workersWithBookingCount = workers.map(worker => ({
    ...worker._doc,
    bookingCount: worker.bookings.length
  }))

  // sort the workers by the count of their bookings in ascending order
  workersWithBookingCount.sort((a, b) => a.bookingCount - b.bookingCount)

  // the worker with the least bookings is the first one in the sorted array
  const workerWithLeastBookings = workersWithBookingCount[0]

  response.json(workerWithLeastBookings)
})

module.exports = bookingsRouter