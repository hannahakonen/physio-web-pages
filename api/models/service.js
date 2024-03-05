const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  workers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
})

const Service = mongoose.model('Service', serviceSchema)

module.exports = Service