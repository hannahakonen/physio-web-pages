const mongoose = require('mongoose')

const worktimeSchema = new mongoose.Schema({
  start: Date,
  end: Date,
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Worktime = mongoose.model('Worktime', worktimeSchema)

module.exports = Worktime