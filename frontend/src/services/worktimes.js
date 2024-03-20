import axios from 'axios'
const baseUrl = '/api/worktimes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getWorktimesByWorkers = async (workers) => {
  const response = await axios.get(`${baseUrl}/workers?usernames=${workers.join(',')}`)
  return response.data
}

const getWorktimesByWorker = async (worker) => {
  const response = await axios.get(`${baseUrl}/workers/${worker}`)
  return response.data
}

const removeWorktime = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

const addWorktime = async (newWorktime, username) => {
  const response = await axios.post(`${baseUrl}/workers/${username}`, newWorktime)
  return response.data
}

export default { getAll, getWorktimesByWorkers, getWorktimesByWorker, removeWorktime, addWorktime }