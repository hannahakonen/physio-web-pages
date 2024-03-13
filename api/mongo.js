const mongoose = require('mongoose')
const User = require('./models/user')
const Note = require('./models/note')
const bcrypt = require('bcrypt')
const Service = require('./models/service')
const Worktime = require('./models/worktime')
const Booking = require('./models/booking')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

//testPhysioApp is the name of the database
//const url =
//  `mongodb+srv://johannahakonen:${password}@physio.efefq.mongodb.net/testPhysioApp?retryWrites=true&w=majority`

//physioApp is the name of the database
const url =
  `mongodb+srv://johannahakonen:${password}@physio.efefq.mongodb.net/physioApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// Adding a new service to the database
/*
const newService = new Service({
  type: 'Päähieronta',
  name: 'Päähieronta 45 min',
  duration: 45,
  priceByWorker: [
    {
      worker: '65eaff6db22b4f0a35a744d8',
      price: 56
    },
    {
      worker: '65eb000a06cdcb9bed6cde0a',
      price: 54
    }
  ]
})

newService.save()
  .then(() => {
    console.log('New service saved successfully!')
    mongoose.connection.close()
  })
  .catch(err => console.log(err))
*/

// Adding a new worktime to the database
/*
const worktimeSchema = new mongoose.Schema({
  start: Date,
  end: Date,
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Worktime = mongoose.model('Worktime', worktimeSchema)
const startTime = new Date(2024, 2, 1, 14, 0)
const endTime = new Date(2024, 2, 1, 18, 45)

const newTime = new Worktime({
  start: startTime,
  end: endTime,
  worker: '65affaa8e44acd2968c22c4d'
})

newTime.save()
  .then(() => {
    console.log('New time saved successfully!')
    mongoose.connection.close()
  })
  .catch(err => console.log(err))
*/

// Adding a new booking to the database
/*
const bookingSchema = new mongoose.Schema({
  type: String,
  services: [String],
  start: Date,
  end: Date,
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customer: {
    firstName: String,
    lastName: String,
    email: String
  }
})

const Booking = mongoose.model('Booking', bookingSchema)
const startTime = new Date(2024, 1, 30, 16, 30)
const endTime = new Date(2024, 1, 30, 17, 30)

const newTime = new Booking({
  type: 'Klassinen hieronta',
  services: ['Klassinen hieronta 60 min'],
  start: startTime,
  end: endTime,
  worker: '65affaa8e44acd2968c22c4d',
  customer: {
    firstName: 'Maija',
    lastName: 'Meikalainen',
    email: 'maija.meikalainen@gmail.com'
  }
})

newTime.save()
  .then(() => {
    console.log('New time saved successfully!')
    mongoose.connection.close()
  })
  .catch(err => console.log(err))
*/

/*
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'plop plop plop',
  important: true,
})

// Note saved to database to a certain user
note.save()
  .then(savedNote => {
    // Then, find the user and add the note's id to the user's notes array
    User.findById('65afe43ed540fd0e73c06850') // replace 'user id' with the actual user id
      .then(user => {
        user.notes.push(savedNote._id)
        user.save()
          .then(() => {
            console.log('user updated with new note!')
            mongoose.connection.close()
          })
      })
  })
  .catch(err => console.log(err))

// Note saved to database
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
*/

/*
const userSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})
*/

//Adding a new user to the database
// not tested with passwordhashing
/*
const userPassword = 'salainen'
const saltRounds = 10

async function hashPassword(userPassword, saltRounds) {
  const passwordHash = await bcrypt.hash(userPassword, saltRounds)
  return passwordHash
}

const passwordHash = hashPassword(userPassword, saltRounds)

const user = new User({
  username: 'maijamattila',
  firstName: 'Maija',
  lastName: 'Mattila',
  email: 'maija.mattila@gmail.com',
  phone: '0401234569',
  role: 3,
  passwordHash: passwordHash
})

user.save().then(result => {
  console.log('user saved!')
  mongoose.connection.close()
})
*/

/*
const userId = '65affaa8e44acd2968c22c4d' // replace with the actual user id
const noteId = '65ae29fd67fc19ecbb6fe100' // replace with the actual note id

// Find the user
User.findById(userId)
  .then(user => {
    // Find the note
    Note.findById(noteId)
      .then(note => {
        // Add the user's id to the note's user field
        note.user = user._id
        user.notes.push(note._id)

        // Save both the note and the user
        return Promise.all([note.save(), user.save()])
      })
      .then(() => {
        console.log('note updated with user!')
        mongoose.connection.close()
      })
  })
  .catch(err => console.log(err))
*/

/*
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
*/


// change the password of the user
//const bcrypt = require('bcrypt')
/*
const saltRounds = 10 // or whatever value you want

const username = 'maijamattila' // replace with the actual username
const newPassword = 'salainen' // replace with the actual new password

// Hash the new password
bcrypt.hash(newPassword, saltRounds)
  .then(newPasswordHash => {
    // Find the user and update their password
    User.findOneAndUpdate(
      { username: username },
      { passwordHash: newPasswordHash },
      { new: true } // this option returns the updated document
    )
      .then(updatedUser => {
        console.log('User password updated!')
        mongoose.connection.close()
      })
  })
  .catch(err => console.log(err))
  */

// Add all worktimes to the user
/*
const userId = '65eaff6db22b4f0a35a744d8' // replace with the actual ID

async function addWorktimesToUser() {
  try {
    // Fetch all worktimes
    const worktimes = await Worktime.find({})

    // Extract the IDs of the worktimes
    const worktimeIds = worktimes.map(worktime => worktime._id)

    // Update the user with the worktime IDs
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { worktimes: { $each: worktimeIds } } },
      { new: true, useFindAndModify: false }
    )

    console.log(updatedUser)
  } catch (error) {
    console.error(error)
  }
}

addWorktimesToUser()
*/

// Add all bookings to the user
/*
const userId = '65eaff6db22b4f0a35a744d8' // replace with the actual ID

async function addBookingsToUser() {
  try {
    // Fetch all bookings
    const bookings = await Booking.find({})

    // Extract the IDs of the bookings
    const bookingIds = bookings.map(booking => booking._id)

    // Update the user with the booking IDs
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { bookings: { $each: bookingIds } } },
      { new: true, useFindAndModify: false }
    )

    console.log(updatedUser)
  } catch (error) {
    console.error(error)
  }
}

addBookingsToUser()
*/

// Add all services to the user
/*
const userId = '65eaff6db22b4f0a35a744d8' // replace with the actual ID

async function addServicesToUser() {
  try {
    // Fetch all services
    const services = await Service.find({})

    // Extract the IDs of the services
    const serviceIds = services.map(service => service._id)

    // Update the user with the service IDs
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { services: { $each: serviceIds } } },
      { new: true, useFindAndModify: false }
    )

    console.log(updatedUser)
  } catch (error) {
    console.error(error)
  }
}

addServicesToUser()
*/

// Add service field to all users
/*
async function addServicesFieldToUsers() {
  try {
    // Update all users to include the services field
    const result = await User.updateMany(
      {},
      { $set: { services: [] } }
    )

    console.log(result)
  } catch (error) {
    console.error(error)
  }
}

addServicesFieldToUsers()
*/

/*
const userId = '65eb000a06cdcb9bed6cde0a' // replace with the actual ID
const serviceIds = ['65eb2fcd97330ed73b59c194', '65eb322da172693c1b1378f0'] // replace with the actual IDs

async function addSpecificServicesToUser() {
  try {
    // Update the user with the service IDs
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { services: { $each: serviceIds } } },
      { new: true, useFindAndModify: false }
    )

    console.log(updatedUser)
  } catch (error) {
    console.error(error)
  }
}

addSpecificServicesToUser()
*/

const userId = '65eb000a06cdcb9bed6cde0a'
const worktimeId = '65f1b5c60bc2b8be9e750f9e'

User.findByIdAndUpdate(
  userId,
  { $push: { worktimes: worktimeId } },
  { new: true, useFindAndModify: false }
)
  .then(updatedUser => {
    // Handle success
    console.log(updatedUser)
  })
  .catch(error => {
    // Handle error
    console.error(error)
  })