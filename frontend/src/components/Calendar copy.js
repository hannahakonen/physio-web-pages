import React, { useState, useEffect } from 'react'
import worktimeService from '../services/worktimes'
import bookingService from '../services/bookings'

const Calendar = ({ onSelect, onWorkerSelect, onBackTwo }) => {
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
        setWorktimes(initialBookings)
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
      <WorkerSelection onSelect={onWorkerSelect} />
      <WeekView startDate={startDate} worktimes={worktimes} bookings={bookings} onSelect={onSelect} />
    </div>
  )
}

// TO DO: names/photos of workers from DB according to the selected service
// TO DO: onCLick: setSelectedWorker selected, worker's times shown
const WorkerSelection = ({ onSelect }) => {
  const workers = ['Kuka tahansa', 'Laura', 'Mikko']
  return (
    <div>
      {workers.map((worker, i) => (
        <button key={i} onClick={() => onSelect(worker)}>
          {worker}
        </button>
      ))}
    </div>
  )
}

const WeekView = ({ startDate, worktimes, bookings, onSelect }) => {
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
                <Day date={date} worktimes={worktimes} bookings={bookings} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const Day = ({ date, worktimes, bookings }) => {
  //poista
  const [timeSlots, setTimeSlots] = useState([])

  // TO DO: what if there is no worktime?
  // TO DO: what if there are more than one worktime, e.g. 10-13 and 17-19?
  // TO DO: Going through all worktimes and adding slots to the array

  const worktime = worktimes.find(worktime => {
    const startDate = new Date(worktime.start)
    return startDate.getDate() === date.getDate() && startDate.getMonth() === date.getMonth()
  })
  let startTime = worktime ? new Date(worktime.start) : new Date(date)
  let endTime = worktime ? new Date(worktime.end) : new Date(date)
  /*
  let startTime = new Date(date)
  startTime.setHours(14, 0, 0, 0)
  console.log(startTime)

  let endTime = new Date(date)
  endTime.setHours(18, 45, 0, 0)
  console.log(endTime)
  */

  // TO DO: this from DB
  // REMEMBER TO CHANGE THE DURATION
  let serviceDuration = 30 / 60
  let breakDuration = 15 / 60

  const bookingList = bookings.filter(booking => {
    const startDate = new Date(booking.start)
    return startDate.getDate() === date.getDate() && startDate.getMonth() === date.getMonth()
  })
  /*
  let bookingTimes = bookingList.map(booking => ({
    start: booking.start,
    end: booking.end
  }))
  console.log(bookingTimes)
  */

  let bookingStartFirst = new Date(date)
  bookingStartFirst.setHours(15, 30, 0, 0)

  let bookingEndFirst = new Date(date)
  bookingEndFirst.setHours(16, 0, 0, 0)

  let bookingStartSecond = new Date(date)
  bookingStartSecond.setHours(16, 15, 0, 0)

  let bookingEndSecond = new Date(date)
  bookingEndSecond.setHours(16, 45, 0, 0)

  let bookingStartThird = new Date(date)
  bookingStartThird.setHours(17, 30, 0, 0)

  let bookingEndThird = new Date(date)
  bookingEndThird.setHours(18, 0, 0, 0)

  //let bookingTimes = [{ start: bookingStartFirst, end: bookingEndFirst }]
  let bookingTimes = [{ start: bookingStartFirst, end: bookingEndFirst },
    { start: bookingStartSecond, end: bookingEndSecond },
    { start: bookingStartThird, end: bookingEndThird }]

  //let bookingTimes = []

  function calculateAvailableSlots(startTime, endTime, serviceDuration, breakDuration, bookingTimes) {
    // Convert the times to minutes
    let start = startTime.getHours() * 60 + startTime.getMinutes()
    let end = endTime.getHours() * 60 + endTime.getMinutes()
    let service = serviceDuration * 60
    let breakTime = breakDuration * 60

    // Initialize an array for the slots
    let slots = []

    // Create the initial slots every 30 minutes
    for (let current = start; current <= end - service; current += 30) {
      let slot = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 0, current)
      slots.push(slot)
    }

    // Add a slot for endTime - serviceDuration if it's not already a slot
    let lastSlotTime = end - service
    let lastSlot = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 0, lastSlotTime)
    if (!slots.some(slot => slot.getTime() === lastSlot.getTime())) {
      slots.push(lastSlot)
    }

    // Sort the bookings in ascending order of the start time
    bookingTimes.sort((a, b) => a.start - b.start)

    // Go through each booking
    for (let i = 0; i < bookingTimes.length; i++) {
      let booking = bookingTimes[i]
      // Calculate the start and end of the booking in minutes
      let bookingStart = booking.start.getHours() * 60 + booking.start.getMinutes()
      let bookingEnd = booking.end.getHours() * 60 + booking.end.getMinutes()

      //
      if (bookingStart - breakTime - service > start) {
        let newSlot = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 0, bookingStart - breakTime - service)
        if (!slots.some(slot => slot.getTime() === newSlot.getTime())) {
          slots.push(newSlot)
        }
      }

      if (bookingEnd + breakTime <= end - service) {
        let newSlot = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 0, bookingEnd + breakTime)
        if (!slots.some(slot => slot.getTime() === newSlot.getTime())) {
          slots.push(newSlot)
        }
      }

      // Add a slot for the end of the booking and a slot for the end of the booking plus the break duration
      /*
      if (bookingEnd <= end - service) {
        let slot = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 0, bookingEnd)
        slots.push(slot)
        if (bookingEnd + breakTime <= end - service) {
          // Check if the next booking starts after the end of the current booking plus the break duration
          if (i === bookings.length - 1 || bookings[i + 1].start.getHours() * 60 + bookings[i + 1].start.getMinutes() > bookingEnd + breakTime) {
            let slot = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 0, bookingEnd + breakTime)
            slots.push(slot)
          }
        }
      }*/
    }

    // Remove the slots that overlap with a booking
    slots = slots.filter(slot => {
      let slotTime = slot.getHours() * 60 + slot.getMinutes()
      return !bookingTimes.some(booking => {
        let bookingStart = booking.start.getHours() * 60 + booking.start.getMinutes()
        let bookingEnd = booking.end.getHours() * 60 + booking.end.getMinutes()
        return slotTime > (bookingStart - breakTime - service) && slotTime < (bookingEnd + breakTime)
      })
    })

    // Sort the slots in ascending order of the time
    slots.sort((a, b) => a - b)

    return slots
  }


  let slots = calculateAvailableSlots(startTime, endTime, serviceDuration, breakDuration, bookingTimes)

  // Print the slots
  slots.forEach(slot => {
    console.log(slot)
  })

  //poista
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
      <button onClick={handleAddTimeSlot}>Add Time Slot</button><br></br>
      {slots.map((slot, i) => (
        <><button key={i}>{slot.getHours()}:{slot.getMinutes()}</button><br></br></>
      ))}
    </div>
  )
}


export default Calendar