const worktimesRouter = require('express').Router()
const { default: mongoose } = require('mongoose')
const Worktime = require('../models/worktime')
const Worker = require('../models/user')
const User = require('../models/user')

worktimesRouter.get('/', async (request, response) => {
  const worktimes = await Worktime.find({}).populate('worker', { username: 1, firstName: 1 })
  response.json(worktimes)
})

worktimesRouter.get('/workers', async (request, response) => {
  const usernames = request.query.usernames.split(',')
  const workers = await Worker.find({ username: { $in: usernames } })
  const workerIds = workers.map(worker => worker._id)
  const worktimes = await Worktime.find({ worker: { $in: workerIds } }).populate('worker', { username: 1, name: 1 })
  response.json(worktimes)
})

worktimesRouter.get('/workers/:username', async (request, response) => {
  const worker = await Worker.findOne({ username: request.params.username })
  const worktimes = await Worktime.find({ worker: worker._id }).populate('worker', { username: 1, name: 1 })
  response.json(worktimes)
})

worktimesRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    const worktime = await Worktime.findByIdAndRemove(id).session(session)

    if (!worktime) {
      throw new Error('Worktime not found')
    }

    await User.updateMany(
      { worktimes: id },
      { $pull: { worktimes: id } },
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

// add worktime to worktimes and user's worktimes
worktimesRouter.post('/workers/:username', async (request, response) => {
  const { start, end } = request.body
  const worker = await Worker.findOne({ username: request.params.username })

  if (!worker) {
    return response.status(404).json({ error: 'Worker not found' })
  }

  const newWorktime = new Worktime({
    start: new Date(start),
    end: new Date(end),
    worker: worker._id
  })

  const savedWorktime = await newWorktime.save()

  // Add the new worktime's ID to the worker's worktimes array
  await Worker.findByIdAndUpdate(worker._id, { $push: { worktimes: savedWorktime._id } })

  response.status(201).json(savedWorktime)
})


module.exports = worktimesRouter