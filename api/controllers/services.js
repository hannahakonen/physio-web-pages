const servicesRouter = require('express').Router()
const Service = require('../models/service')

servicesRouter.get('/', async (request, response) => {
  const services = await Service.find({}).populate('workers', { username: 1, name: 1 })
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
      { $group: { _id: '$name', minPrice: { $min: '$price' }, duration: { $first: '$duration' } } }
    ])

    if (services.length > 0) {
      response.json(services.map(service => ({ name: service._id, minPrice: service.minPrice, duration: service.duration })))
    } else {
      response.status(404).send({ error: 'No services found for this type' })
    }
  } catch (error) {
    console.error(error)
    response.status(500).send({ error: 'Something went wrong' })
  }
})

module.exports = servicesRouter