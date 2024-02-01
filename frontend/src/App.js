import './App.css'
import { useState, useEffect, useRef } from 'react'
import Home from './components/Home'
import Booking from './components/Booking'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'
import Login from './components/LoginForm'
import noteService from './services/notes'
import loginService from './services/login'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])
  console.log('render', notes.length, 'notes')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const login = (user) => {
    setUser(user)
  }
  /*
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }*/

  const Notes = () => (
    <div className="App">
      <header className="App-header">

        <Notification message={errorMessage} />
        <div>
          <h1>Notes</h1>

          {/*!user && loginForm()*/}

          {user && <div>
            <p>{user.name} logged in</p>
            <button onClick={handleLogout}>Logout</button>
            {noteForm()}
          </div>
          }

          <button onClick={() => setShowAll(!showAll)}>
            show {showAll ? 'important' : 'all'}
          </button>
        </div>
        <ul className="Notes-list">
          {notesToShow.map(note =>
            <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
          )}
        </ul>
      </header>
    </div>
  )

  // not in use
  /*
  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <Login
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )*/

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    noteService.setToken(null)
    setUser(null)
  }

  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const noteFormRef = useRef()

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">Koti</Link>
        <Link style={padding} to="/ajanvaraus">Ajanvaraus</Link>
        <Link style={padding} to="/notes">Notes</Link>
        {user
          ? (
            <>
              <em>{user.name} logged in</em>
              <Link style={padding} to="/" onClick={handleLogout}>Logout</Link>
            </>
          )
          : <Link style={padding} to="/login">Login</Link>
        }
      </div>

      <Routes>
        <Route path="/ajanvaraus" element={<Booking />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={login} />} />
      </Routes>

      <div className="App">
        <Footer />
      </div>
    </Router>
  )
}

export default App