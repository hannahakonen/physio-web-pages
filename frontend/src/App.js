import './App.css'
import React, { useState, useEffect, useRef } from 'react'
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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom'
import Notes from './components/Notes'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import Calendar from './components/Calendar'
import WorkerPage from './components/WorkerPage'
import Services from './components/Services'
import { AppBar, Button, Container, Toolbar, Typography, Box, IconButton, Grid } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Drawer, List, ListItem } from '@mui/material'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AddBoxOutlined } from '@material-ui/icons'

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

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
    <React.Fragment>
      <CssBaseline />
      <div className="page-container">
        <AppBar position="static" sx={{ backgroundColor: 'rgb(114, 98, 130)' }}>
          <Toolbar>
            {isMobile ? (
              <>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="left"
                  open={drawerOpen}
                  onClose={handleDrawerToggle}
                >
                  <List>
                    <ListItem button component={RouterLink} to="/" onClick={handleDrawerToggle}>Koti</ListItem>
                    <ListItem button component={RouterLink} to="/ajanvaraus" onClick={handleDrawerToggle}>Ajanvaraus</ListItem>
                    <ListItem button component={RouterLink} to="/palvelut" onClick={handleDrawerToggle}>Palvelut</ListItem>
                    <ListItem button component={RouterLink} to="/notes" onClick={handleDrawerToggle}>Notes</ListItem>
                  </List>
                </Drawer>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/">Koti</Button>
                <Button color="inherit" component={RouterLink} to="/ajanvaraus">Ajanvaraus</Button>
                <Button color="inherit" component={RouterLink} to="/palvelut">Palvelut</Button>
                <Button color="inherit" component={RouterLink} to="/notes">Notes</Button>
              </>
            )}

            <Box sx={{ flexGrow: 1 }} />


            {user
              ? (
                <>
                  <Button color="inherit" component={RouterLink} to="/worker">{user.firstName}</Button>
                  <Button color="inherit" component={RouterLink} to="/" onClick={handleLogout}>Logout</Button>
                </>
              )
              : <Button color="inherit" component={RouterLink} to="/login">Login</Button>}
          </Toolbar>
        </AppBar>
        <div className="content-container">
          <Container>
            <Grid container direction="column">
              <Grid item xs={12} flexGrow={1} py={3}>
                <Box maxWidth="md" margin="auto">
                  <Routes>
                    <Route path="/ajanvaraus" element={<Booking />} />
                    <Route path="/palvelut" element={<Services />} />
                    <Route path="/notes" element={<Notes user={user} />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login onLogin={login} />} />
                    <Route path="/worker" element={<WorkerPage user={user} />} />
                  </Routes>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </div>
        <Footer />
      </div>
    </React.Fragment >
  )
}

export default App