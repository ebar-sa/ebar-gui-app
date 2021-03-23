import axios from 'axios'
import authHeader from './auth-header'

const ENDPOINT = 'http://localhost:8080/api/'

export function getTables() {
  const URL = ENDPOINT + 'tables'
  return axios.get(URL, { headers: authHeader() }).then((res) => {
    return res.json()
  })
}
