const bookingsRouter = require('express').Router()
const { default: mongoose } = require('mongoose')
const Booking = require('../models/booking')
const User = require('../models/user')

bookingsRouter.get('/', async (request, response) => {
  const bookings = await Booking.find({}).populate('worker', { username: 1, firstName: 1 })
  response.json(bookings)
})

bookingsRouter.get('/workers/:username', async (request, response) => {
  const worker = await User.findOne({ username: request.params.username })
    .populate({
      path: 'bookings',
      populate: {
        path: 'customer',
        select: 'firstName lastName email phone'
      }
    })

  if (!worker) {
    return response.status(404).json({ error: 'worker not found' })
  }

  response.json(worker.bookings)
})

bookingsRouter.get('/workers', async (request, response) => {
  const usernames = request.query.usernames.split(',')

  const workers = await User.find({ username: { $in: usernames } })
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

bookingsRouter.post('/', async (request, response) => {
  console.log(request.body)
  const { serviceType, service, time, endTime, totalDuration, totalPrice, worker: username, firstName, lastName, phone, email, additionalInfo } = request.body
  console.log(username)

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const staffer = await User.findOne({ username: username }).session(session)
    if (!staffer) {
      throw new Error('The worker does not exist')
    }

    const existingBooking = await Booking.findOne({ time, worker: staffer._id }).session(session)
    if (existingBooking) {
      throw new Error('The worker is already booked at that time')
    }

    let customer = await User.findOne({ email }).session(session)
    if (!customer) {
      customer = new User({ firstName, lastName, phone, email, additionalInfo })
      await customer.save({ session })
    }

    console.log('Username:', username)
    console.log('Staffer:', staffer)

    const booking = new Booking({ type: serviceType, service: service, start: time, end: endTime, duration: totalDuration, price: totalPrice, worker: staffer._id, customer: customer._id })
    await booking.save({ session })

    staffer.bookings.push(booking._id)
    customer.bookings.push(booking._id)
    await staffer.save({ session })
    await customer.save({ session })

    await session.commitTransaction()

    response.status(201).json(booking)
  } catch (error) {
    await session.abortTransaction()
    response.status(400).json({ error: error.message })
  } finally {
    session.endSession()
  }
})

bookingsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    const booking = await Booking.findByIdAndRemove(id).session(session)

    if (!booking) {
      throw new Error('Booking not found')
    }

    await User.updateMany(
      { bookings: id },
      { $pull: { bookings: id } },
      { session }
    )

    await session.commitTransaction()
    response.status(204).end()
  } catch (error) {
    await session.abortTransaction()
    response.status(400).send({ error: 'malformatted id' })
  } finally {
    session.endSession()
  }
})

module.exports = bookingsRouter