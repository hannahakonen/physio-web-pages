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

// get services by type
servicesRouter.get('/types/:type', async (request, response) => {
  try {
    const services = await Service.find({ type: request.params.type }).distinct('name')//.populate('workers', { username: 1, name: 1 })
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

module.exports = servicesRouter