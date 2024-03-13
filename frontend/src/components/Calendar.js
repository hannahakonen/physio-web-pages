import React, { useState, useEffect } from 'react'
import worktimeService from '../services/worktimes'
import bookingService from '../services/bookings'
import Day from './Day'

const Calendar = ({ onSelect, onWorkerSelect, workers, onBackTwo, totalDuration }) => {
  const [startDate, setStartDate] = useState(new Date())
  const [worktimes, setWorktimes] = useState([])
  const [bookings, setBookings] = useState([])

  // Set the start date to the first day of the current week (Mon)
  useEffect(() => {
    const date = new Date()
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is Sunday
    setStartDate(new Date(date.setDate(diff)))
  }, [])

  // Should there be something in the last []?
  useEffect(() => {
    worktimeService
      .getAll()
      .then(initialWorktimes => {
        setWorktimes(initialWorktimes)
      })
  }, [])

  console.log('render', worktimes.length, 'worktimes')

  // Should there be something in the last []?
  useEffect(() => {
    bookingService
      .getAll()
      .then(initialBookings => {
        setBookings(initialBookings)
      })
  }, [])

  // advances the startDate by one week
  const handleNextWeek = () => {
    const nextWeek = new Date(startDate)
    nextWeek.setDate(nextWeek.getDate() + 7)
    setStartDate(nextWeek)
  }

  // checks if the previous week is disabled
  const isPreviousWeekDisabled = () => {
    const currentWeek = new Date()
    const day = currentWeek.getDay()
    const diff = currentWeek.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is Sunday
    currentWeek.setDate(diff)
    return startDate <= currentWeek
  }

  // moves the startDate back by one week
  const handlePreviousWeek = () => {
    const previousWeek = new Date(startDate)
    previousWeek.setDate(previousWeek.getDate() - 7)
    setStartDate(previousWeek)
  }

  // DO: Tiedot button not disabled if at least one time selected
  // DO: Aika button clicked: service and time remains
  // DO: Palvelu button clicked: service remains, time null
  return (
    <div>
      <button onClick={onBackTwo}>Palvelu</button>
      <button>Aika</button>
      <button disabled>Tiedot</button>
      <button disabled>Valmis</button>
      <br></br>
      <button onClick={handlePreviousWeek} disabled={isPreviousWeekDisabled()}>Previous</button>
      <button onClick={handleNextWeek}>Next</button>
      <WorkerSelection onSelect={onWorkerSelect} workers={workers} />
      <WeekView startDate={startDate} worktimes={worktimes} bookings={bookings} onSelect={onSelect} totalDuration={totalDuration} />
    </div>
  )
}

// TO DO: names/photos of workers from DB according to the selected service
// TO DO: onCLick: setSelectedWorker selected, worker's times shown
const WorkerSelection = ({ onSelect, workers }) => {
  //const workers = ['Kuka tahansa', 'Laura', 'Mikko']
  return (
    <div>
      {workers.length > 0 ? (
        workers.map((worker, i) => (
          worker.firstName ? (
            <button key={i} onClick={() => onSelect(worker)}>
              {worker.firstName}
            </button>
          ) : null
        ))
      ) : (
        <p>No workers available</p>
      )}
    </div>
  )
}

const WeekView = ({ startDate, worktimes, bookings, onSelect, totalDuration }) => {
  // Generate an array of dates for the week
  const dates = Array.from({ length: 7 }, (v, i) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    return date
  })

  const weekdays = ['MA', 'TI', 'KE', 'TO', 'PE', 'LA', 'SU']
  // For simplicity, just use a static list of times
  const times = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']

  return (
    <div>
      {times.map(time => (
        <button key={time} onClick={() => onSelect(time)}>
          {time}
        </button>
      ))}
      <table>
        <thead>
          <tr>
            {weekdays.map((weekday, i) => (
              <th key={i}>{weekday}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {dates.map(date => (
              <td key={date.toString()}>
                <Day date={date} worktimes={worktimes} bookings={bookings} totalDuration={totalDuration} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}




export default Calendar