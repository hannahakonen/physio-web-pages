const servicesRouter = require('express').Router()
const Service = require('../models/service')
const User = require('../models/user')
const { default: mongoose } = require('mongoose')


servicesRouter.get('/', async (request, response) => {
  const services = await Service.find({}).populate('workers', { username: 1, firstName: 1 })
  response.json(services)
})

// get all service types
servicesRouter.get('/types', async (request, response) => {
  const types = await Service.find({}).distinct('type')
  response.json(types)
})

// get services by type with the cheapest price
servicesRouter.get('/types/:type', async (request, response) => {
  try {
    const services = await Service.aggregate([
      { $match: { type: request.params.type } },
      { $unwind: '$priceByWorker' },
      {
        $lookup: {
          from: 'users',
          localField: 'priceByWorker.worker',
          foreignField: '_id',
          as: 'priceByWorker.worker'
        }
      },
      { $unwind: '$priceByWorker.worker' },
      {
        $project: {
          name: 1,
          type: 1,
          description: 1,
          duration: 1,
          'priceByWorker.price': 1,
          'priceByWorker.worker': {
            username: 1,
            firstName: 1
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          type: { $first: '$type' },
          description: { $first: '$description' },
          duration: { $first: '$duration' },
          priceByWorker: { $push: '$priceByWorker' },
          minPrice: { $min: '$priceByWorker.price' }
        }
      }
    ])

    if (services.length > 0) {
      response.json(services)
    } else {
      response.status(404).send({ error: 'No services found for this type' })
    }
  } catch (error) {
    console.error(error)
    response.status(500).send({ error: 'Something went wrong' })
  }
})

// get services by worker
servicesRouter.get('/workers/:username', async (request, response) => {
  const worker = await User.findOne({ username: request.params.username }).populate('services')

  if (!worker) {
    return response.status(404).json({ error: 'worker not found' })
  }

  const servicesWithWorkerPrice = worker.services.map(service => {
    const priceByWorker = service.priceByWorker.find(price => price.worker.toString() === worker._id.toString())
    return {
      ...service._doc,
      priceByWorker: priceByWorker ? priceByWorker.price : null
    }
  })

  response.json(servicesWithWorkerPrice)
})

servicesRouter.delete('/:serviceId/:workerUsername', async (request, response) => {
  const { serviceId, workerUsername } = request.params
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    // Find the worker by their username
    const worker = await User.findOne({ username: workerUsername }).session(session)

    if (!worker) {
      throw new Error('Worker not found')
    }

    const service = await Service.findById(serviceId).session(session)

    if (!service) {
      throw new Error('Service not found')
    }

    // Remove the price and worker object from priceByWorker
    service.priceByWorker = service.priceByWorker.filter(priceByWorker => priceByWorker.worker.toString() !== worker._id.toString())
    await service.save({ session })

    // Remove the service from the services field of the user document
    await User.updateOne(
      { _id: worker._id, services: serviceId },
      { $pull: { services: serviceId } },
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

module.exports = servicesRouter