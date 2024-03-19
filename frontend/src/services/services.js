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

const getServicesByWorker = async (worker) => {
  const response = await axios.get(`${baseUrl}/workers/${worker}`)
  return response.data
}

export default { getAllTypes, getServicesByType, getServicesByWorker }