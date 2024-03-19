import React, { useEffect, useState } from 'react'
import serviceServices from '../services/services'
import worktimeServices from '../services/worktimes'
import bookingServices from '../services/bookings'

const WorkerPage = ({ user }) => {
  // Add functionality for changing worktimes, bookings, and services here
  console.log('WorkerPage user:', user)
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [worktimes, setWorktimes] = useState([])

  useEffect(() => {
    worktimeServices
      .getWorktimesByWorker(user.username)
      .then(initialWorktimes => {
        console.log('Initial worktimes:', initialWorktimes)
        setWorktimes(initialWorktimes)
      })
  }, [user])

  useEffect(() => {
    bookingServices
      .getBookingsByWorker(user.username)
      .then(initialBookings => {
        console.log('Initial bookings:', initialBookings)
        setBookings(initialBookings)
      })
  }, [user])

  useEffect(() => {
    serviceServices
      .getServicesByWorker(user.username)
      .then(initialServices => {
        console.log('Initial services:', initialServices)
        setServices(initialServices)
      })
  }, [user])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome, {user ? user.firstName : 'Guest'}</h1>
        <OwnWorktimes user={user} worktimes={worktimes} />
        <OwnBookings user={user} bookings={bookings} />
        <OwnServices user={user} services={services} />
      </header>
    </div>
  )
}

const OwnWorktimes = ({ user, worktimes }) => {
  // Add functionality for changing worktimes here

  return (
    <div>
      <h2>Työajat</h2>
      {worktimes.map((worktime, index) => (
        <div key={index}>
          {worktime.start} - {worktime.end}
        </div>
      ))}
    </div>
  )
}

const OwnBookings = ({ user, bookings }) => {

  return (
    <div>
      <h2>Varaukset</h2>
      {bookings.map((booking, index) => (
        <div key={index}>
          {booking.start} - {booking.end}
        </div>
      ))}
    </div>
  )
}

const OwnServices = ({ user, services }) => {
  // Add functionality for changing services here

  return (
    <div>
      <h2>Palvelut</h2>
      {services.map((service, index) => (
        <div key={index}>
          {service.name} {service.duration} min
        </div>
      ))}
    </div>
  )
}



export default WorkerPage