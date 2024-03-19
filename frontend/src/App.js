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
import Notes from './components/Notes'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import Calendar from './components/Calendar'
import WorkerPage from './components/WorkerPage'

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      loginService.setToken(user.token)
    }
  }, [])

  const login = (user) => {
    setUser(user)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    loginService.setToken(null)
    setUser(null)
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">Koti</Link>
        <Link style={padding} to="/ajanvaraus">Ajanvaraus</Link>
        <Link style={padding} to="/notes">Notes</Link>
        {user
          ? (
            <>
              <Link style={padding} to="/worker">{user.firstName}</Link>
              <Link style={padding} to="/" onClick={handleLogout}>Logout</Link>
            </>
          )
          : <Link style={padding} to="/login">Login</Link>
        }
      </div>

      <Routes>
        <Route path="/ajanvaraus" element={<Booking />} />
        <Route path="/notes" element={<Notes user={user} />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/worker" element={<WorkerPage user={user} />} />
      </Routes>

      <div className="App">
        <Footer />
      </div>
    </div>
  )
}

export default App