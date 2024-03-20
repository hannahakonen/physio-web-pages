import axios from 'axios'
const baseUrl = '/api/bookings'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

//worker=username
const getBookingsByWorker = async (worker) => {
  const response = await axios.get(`${baseUrl}/workers/${worker}`)
  return response.data
}

const getWorkerWithLeastBookings = async (workers) => {
  const response = await axios.get(`${baseUrl}/workers?usernames=${workers.join(',')}`)
  return response.data
}

const createBooking = async (bookingData) => {
  try {
    const response = await axios.post('/api/bookings', bookingData)
    console.log('Booking created:', response.data)
  } catch (error) {
    console.error('Error creating booking:', error.response.data)
  }
}

const removeBooking = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

export default { getAll, getWorkerWithLeastBookings, createBooking, getBookingsByWorker, removeBooking }