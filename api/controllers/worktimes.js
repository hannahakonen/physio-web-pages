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

module.exports = worktimesRouter