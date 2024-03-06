import axios from 'axios'
const baseUrl = '/api/services'

const getAllTypes = () => {
  const request = axios.get(`${baseUrl}/types`)
  return request.then(response => response.data)
}

// get service names, cheapest price and duration by type
const getServicesByType = (type) => {
  const request = axios.get(`${baseUrl}/types/${type}`)
  return request.then(response => response.data)
}

export default { getAllTypes, getServicesByType }