const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v)
      },
      message: props => `${props.value} is not a valid email address!`
    },
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
  role: {
    type: Number,
    default: 1,
  },
  passwordHash: String,
  worktimes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worktime'
    }
  ],
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }
  ],
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    }
  ],
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
  special: String,
  emailList: {
    type: Boolean,
    default: false
  },
  smsList: {
    type: Boolean,
    default: false
  }
})

userSchema.plugin(uniqueValidator)

// Define a pre-save hook for the User model
userSchema.pre('validate', function(next) {
  // If this is a new document (i.e., a new user is being created) and no username is provided
  if (this.isNew && !this.username) {
    // Generate a new ObjectId and use its string representation as the username
    this.username = new mongoose.Types.ObjectId().toString()
  }

  next()
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User