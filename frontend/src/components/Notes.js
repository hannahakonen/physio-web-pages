import React, { useState, useEffect, useRef } from 'react'
import noteService from '../services/notes'
import loginService from '../services/login'
import Note from './Note'
import Notification from './Notification'
import NoteForm from './NoteForm'
import Togglable from './Togglable'

const Notes = ({ user }) => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  console.log('render', notes.length, 'notes')

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

  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const noteFormRef = useRef()
  return (
    <div className="App">
      <header className="App-header">

        <Notification message={errorMessage} />
        <div>
          <h1>Notes</h1>

          {user && <div>
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
}

export default Notes