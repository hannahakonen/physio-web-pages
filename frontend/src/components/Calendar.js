import React, { useState, useEffect } from 'react'

const Calendar = () => {
  const [startDate, setStartDate] = useState(new Date())

  useEffect(() => {
    const date = new Date()
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6:1) // adjust when day is Sunday
    setStartDate(new Date(date.setDate(diff)))
  }, [])

  const handleNextWeek = () => {
    const nextWeek = new Date(startDate)
    nextWeek.setDate(nextWeek.getDate() + 7)
    setStartDate(nextWeek)
  }

  const isPreviousWeekDisabled = () => {
    const currentWeek = new Date()
    const day = currentWeek.getDay()
    const diff = currentWeek.getDate() - day + (day === 0 ? -6:1) // adjust when day is Sunday
    currentWeek.setDate(diff)
    return startDate <= currentWeek
  }

  const handlePreviousWeek = () => {
    const previousWeek = new Date(startDate)
    previousWeek.setDate(previousWeek.getDate() - 7)
    setStartDate(previousWeek)
  }

  return (
    <div className="App-header">
      <button onClick={handlePreviousWeek} disabled={isPreviousWeekDisabled()}>Previous</button>
      <button onClick={handleNextWeek}>Next</button>
      <WeekView startDate={startDate} />
    </div>
  )
}

const WeekView = ({ startDate }) => {
  // Generate an array of dates for the week
  const dates = Array.from({ length: 7 }, (v, i) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    return date
  })

  const weekdays = ['MA', 'TI', 'KE', 'TO', 'PE', 'LA', 'SU']

  return (
    <table>
      <thead>
        <tr>
          {dates.map((date, i) => (
            <th key={date.toString()}>{weekdays[i]}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {dates.map(date => (
            <td key={date.toString()}>
              <Day date={date} />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

const Day = ({ date }) => {
  const [timeSlots, setTimeSlots] = useState([])

  const handleAddTimeSlot = () => {
    const newTimeSlot = prompt('Enter a new time slot:')
    setTimeSlots(timeSlots.concat(newTimeSlot))
  }

  return (
    <div>
      <div>{date.getDate()}.{date.getMonth() + 1}.</div>
      {timeSlots.map((timeSlot, i) => (
        <div key={i}>{timeSlot}</div>
      ))}
      <button onClick={handleAddTimeSlot}>Add Time Slot</button>
    </div>
  )
}

export default Calendar