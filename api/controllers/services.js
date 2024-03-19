const servicesRouter = require('express').Router()
const Service = require('../models/service')
const User = require('../models/user')

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

  response.json(worker.services)
})

module.exports = servicesRouter