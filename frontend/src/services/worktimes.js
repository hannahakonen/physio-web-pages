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

export default { getAll, getWorktimesByWorkers }