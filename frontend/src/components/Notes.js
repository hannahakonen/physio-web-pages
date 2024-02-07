const Notes = () => (
  <div className="App">
    <header className="App-header">

      <Notification message={errorMessage} />
      <div>
        <h1>Notes</h1>

        {!user && loginForm()}

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

export default Notes