const mongoose = require('mongoose')
const User = require('./models/user')
const Note = require('./models/note')

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

/*
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})
*/

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

/*
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
/*
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

const User = mongoose.model('User', userSchema)

const user = new User({
  username: 'katijo',
  name: 'Me Me',
  passwordHash: 'salainen'
})

user.save().then(result => {
  console.log('note saved!')
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
const bcrypt = require('bcrypt')
const saltRounds = 10 // or whatever value you want

const username = 'katijo' // replace with the actual username
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