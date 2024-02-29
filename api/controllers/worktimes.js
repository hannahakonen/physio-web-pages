const worktimesRouter = require('express').Router()
const Worktime = require('../models/worktime')

worktimesRouter.get('/', async (request, response) => {
  const worktimes = await Worktime.find({}).populate('worker', { username: 1, name: 1 })
  response.json(worktimes)
})

module.exports = worktimesRouter