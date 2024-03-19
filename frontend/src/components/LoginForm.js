import PropTypes from 'prop-types'
import Togglable from './Togglable'
import { useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import noteService from '../services/notes'
import { useState, useEffect, useRef } from 'react'
import Notification from './Notification'

const Login = (props) => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      loginService.setToken(user.token)  // is this necessary?
      //setUser(user)
      props.onLogin(user)
      setUsername('')
      setPassword('')

      //console.log('user.role', user.role)
      if (user.role & 2) {
        navigate('/worker')
      } else {
        navigate('/')
      }

      //navigate('/')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <Notification message={errorMessage} />
        <h2>Login</h2>

        <form onSubmit={onSubmit}>
          <div>username<input value={username} onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>password<input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">Login</button>
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>

        </form>
      </header>
    </div >
  )
}

Login.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default Login