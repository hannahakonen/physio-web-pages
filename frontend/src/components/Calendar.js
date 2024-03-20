import React, { useState, useEffect } from 'react'
import worktimeService from '../services/worktimes'
import bookingService from '../services/bookings'
import WorkerSelection from './WorkerSelection'
import WeekView from './WeekView'

const Calendar = ({ onSelect, onWorkerSelect, workers, onBackTwo, totalDuration, worker }) => {
  const [startDate, setStartDate] = useState(new Date())
  const [worktimes, setWorktimes] = useState([])
  const [bookings, setBookings] = useState([])
  //console.log('Worker in the beginning of calendar component:', worker)

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
      .getWorktimesByWorkers(workers.map(worker => worker.username))
      .then(initialWorktimes => {
        setWorktimes(initialWorktimes)
      })
  }, [workers])

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
      <WeekView startDate={startDate} worktimes={worktimes} bookings={bookings} onSelect={onSelect} totalDuration={totalDuration} worker={worker} />
    </div>
  )
}

export default Calendar