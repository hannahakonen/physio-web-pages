import React, { useEffect, useState } from 'react'
import serviceServices from '../services/services'
import worktimeServices from '../services/worktimes'
import bookingServices from '../services/bookings'
import CancelIcon from '@mui/icons-material/Cancel'

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

  const handleRemoveWorktime = (worktime) => {
    console.log('Removing worktime:', worktime)
    worktimeServices
      .removeWorktime(worktime._id)
      .then(() => {
        setWorktimes(worktimes.filter(w => w._id !== worktime._id))
      })
  }

  const handleRemoveBooking = (booking) => {
    console.log('Removing booking:', booking)
    bookingServices
      .removeBooking(booking._id)
      .then(() => {
        setBookings(bookings.filter(b => b._id !== booking._id))
      })
  }

  const handleRemoveService = (service, username) => {
    console.log('Removing service:', service)
    serviceServices
      .removeServiceFromWorker(service._id, username)
      .then(() => {
        setServices(services.filter(s => s._id !== service._id))
      })
  }

  const handleAddWorktime = (newWorktime, username) => {
    console.log('Adding worktime:', newWorktime)
    worktimeServices
      .addWorktime(newWorktime, username)
      .then(returnedWorktime => {
        setWorktimes(worktimes.concat(returnedWorktime))
      })
  }

  return (
    <div className="App">
      <header className="App-header">
        <OwnWorktimes user={user} worktimes={worktimes} handleRemoveWorktime={handleRemoveWorktime} handleAddWorktime={handleAddWorktime} />
        <OwnBookings user={user} bookings={bookings} handleRemoveBooking={handleRemoveBooking}/>
        <OwnServices user={user} services={services} handleRemoveService={handleRemoveService}/>
      </header>
    </div>
  )
}

const OwnWorktimes = ({ user, worktimes, handleRemoveWorktime, handleAddWorktime }) => {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const newWorktime = {
      start: new Date(start),
      end: new Date(end),
    }

    handleAddWorktime(newWorktime, user.username)

    setStart('')
    setEnd('')
  }


  worktimes.sort((a, b) => new Date(a.start) - new Date(b.start))

  return (
    <div>
      <h2>Työajat</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Alkaa:
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
        </label>
        <br />
        <label>
          Loppuu:
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Lisää</button>
      </form>
      {worktimes.map((worktime, index) => (
        <div key={index}>
          {new Date(worktime.start).getDate()}.{new Date(worktime.start).getMonth() + 1}.{new Date(worktime.start).getFullYear()} {new Date(worktime.start).getHours()}:{new Date(worktime.start).getMinutes().toString().padStart(2, '0')}
          -{new Date(worktime.end).getHours()}:{new Date(worktime.end).getMinutes().toString().padStart(2, '0')}
          <CancelIcon  onClick={() => handleRemoveWorktime(worktime)} style={{ cursor: 'pointer' }}/>
        </div>
      ))}
    </div>
  )
}

const OwnBookings = ({ user, bookings, handleRemoveBooking }) => {
  bookings.sort((a, b) => new Date(a.start) - new Date(b.start))
  return (
    <div>
      <h2>Varaukset</h2>
      <table>
        <thead>
          <tr>
            <th>Päivä</th>
            <th>Aika</th>
            <th>Nimi</th>
            <th>Sähköposti</th>
            <th>Puhelin</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => {
            const startDate = new Date(booking.start)
            const endDate = new Date(booking.end)
            return (
              <tr key={index}>
                <td>{`${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()}`}</td>
                <td>{`${startDate.getHours()}:${startDate.getMinutes().toString().padStart(2, '0')}`}
                -{`${endDate.getHours()}:${endDate.getMinutes().toString().padStart(2, '0')}`}</td>
                <td>{booking.customer.firstName} {booking.customer.lastName}</td>
                <td>{booking.customer.email}</td>
                <td>{booking.customer.phone}</td>
                <td><CancelIcon onClick={() => handleRemoveBooking(booking)} style={{ cursor: 'pointer' }}/></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const OwnServices = ({ user, services, handleRemoveService }) => {
  const [sortedServices, setSortedServices] = useState([services])

  // Sort the services in ascending order first by type and types by the price
  useEffect(() => {
    const sorted = [...services].sort((a, b) => {
      // Sort by type
      if (a.type < b.type) return -1
      if (a.type > b.type) return 1

      // If types are equal, sort by price
      if (a.priceByWorker < b.priceByWorker) return -1
      if (a.priceByWorker > b.priceByWorker) return 1

      return 0
    })

    setSortedServices(sorted)
  }, [services])

  return (
    <div>
      <h2>Palvelut</h2>
      <table>
        <thead>
          <tr>
            <th>Tyyppi</th>
            <th>Palvelu</th>
            <th>Kesto</th>
            <th>Hinta</th>
            <th>Kuvaus</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedServices.map((service, index) => (
            <tr key={index}>
              <td>{service.type}</td>
              <td>{service.name}</td>
              <td>{`${service.duration} min`}</td>
              <td>{`${service.priceByWorker} €`}</td>
              <td>{service.description}</td>
              <td><CancelIcon  onClick={() => handleRemoveService(service, user.username)} style={{ cursor: 'pointer' }}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default WorkerPage