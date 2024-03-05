import axios from 'axios'
const baseUrl = '/api/services'

const getAllTypes = () => {
  const request = axios.get(`${baseUrl}/types`)
  return request.then(response => response.data)
}

const getServicesByType = (type) => {
  const request = axios.get(`${baseUrl}/types/${type}`)
  return request.then(response => response.data)
}

export default { getAllTypes, getServicesByType }