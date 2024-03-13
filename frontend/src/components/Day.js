import React, { useState } from 'react'

const Day = ({ date, worktimes, bookings, totalDuration }) => {
  //poista
  //const [timeSlots, setTimeSlots] = useState([])

  // TO DO: what if there are more than one worktime per worker, e.g. 10-13 and 17-19?
  // TO DO: Going through all worktimes and adding slots to the array

  const worktimeList = worktimes.filter(worktime => {
    const startDate = new Date(worktime.start)
    return startDate.getDate() === date.getDate() && startDate.getMonth() === date.getMonth()
  })

  function calculateAvailableSlots(startTime, endTime, serviceDuration, breakDuration, bookingTimes) {
    // Convert the times to minutes
    let start = startTime.getHours() * 60 + startTime.getMinutes()
    let end = endTime.getHours() * 60 + endTime.getMinutes()
    let service = serviceDuration * 60
    let breakTime = breakDuration * 60
    //let workerName = worker

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
    if (bookingTimes.length > 1) {
      bookingTimes.sort((a, b) => a.start - b.start)
    }

    // Go through each booking
    for (let i = 0; i < bookingTimes.length; i++) {
      let booking = bookingTimes[i]
      // Calculate the start and end of the booking in minutes
      let bookingStart = booking.start.getHours() * 60 + booking.start.getMinutes()
      let bookingEnd = booking.end.getHours() * 60 + booking.end.getMinutes()

      // Add a bonus slot before a booking if there is enough time
      if (bookingStart - breakTime - service > start) {
        let newSlot = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 0, bookingStart - breakTime - service)
        if (!slots.some(slot => slot.getTime() === newSlot.getTime())) {
          slots.push(newSlot)
        }
      }

      // Add a bonus slot after a booking if there is enough time
      if (bookingEnd + breakTime <= end - service) {
        let newSlot = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), 0, bookingEnd + breakTime)
        if (!slots.some(slot => slot.getTime() === newSlot.getTime())) {
          slots.push(newSlot)
        }
      }
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

  let slots = []

  for (let worktime of worktimeList) {

    let startTime = new Date(worktime.start)
    let endTime = new Date(worktime.end)
    let worker = worktime.worker.username
    /*
      let startTime = new Date(date)
      startTime.setHours(14, 0, 0, 0)
      console.log(startTime)

      let endTime = new Date(date)
      endTime.setHours(18, 45, 0, 0)
      console.log(endTime)
      */

    //let serviceDuration = 60 / 60
    //console.log(serviceDuration)
    let serviceDuration = totalDuration / 60
    console.log(totalDuration)
    let breakDuration = 15 / 60

    const bookingList = bookings.filter(booking => {
      const startDate = new Date(booking.start)
      return startDate.getDate() === date.getDate() && startDate.getMonth() === date.getMonth() && booking.worker.username === worker
    })

    let bookingTimes = bookingList.map(booking => ({
      start: new Date(booking.start),
      end: new Date(booking.end)
    }))
    console.log(bookingTimes)

    /*
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

      //let bookings = [{ start: bookingStartFirst, end: bookingEndFirst }]
      let bookingTimes = [{ start: bookingStartFirst, end: bookingEndFirst },
        { start: bookingStartSecond, end: bookingEndSecond },
        { start: bookingStartThird, end: bookingEndThird }]

      //let bookings = []
      */

    let timeSlots = calculateAvailableSlots(startTime, endTime, serviceDuration, breakDuration, bookingTimes)

    // New array (Date, [worker])
    timeSlots.forEach(slot => {
      // Find the slot with the same date
      let existingSlot = slots.find(s => s.date.getTime() === slot.getTime())

      if (existingSlot) {
        // If the slot exists, add the worker to the workers array
        existingSlot.workers.push(worker)
      } else {
        // If the slot doesn't exist, create a new slot
        slots.push({
          date: slot,
          workers: [worker]
        })
      }
    })

    // Print the slots
    slots.forEach(slot => {
      console.log(slot)
    })
  }

  //poista
  /*
  const handleAddTimeSlot = () => {
    const newTimeSlot = prompt('Enter a new time slot:')
    setTimeSlots(timeSlots.concat(newTimeSlot))
  }
  */

  return (
    <div>
      <div>{date.getDate()}.{date.getMonth() + 1}.</div>
      {slots.map((slot, i) => (
        <><button key={i}>{slot.date.getHours()}:{slot.date.getMinutes()}</button><br></br></>
      ))}
    </div>
  )
}

export default Day