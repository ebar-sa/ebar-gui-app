import http from "../http-common";
import authHeader from './auth-header'

const ENDPOINT = 'http://localhost:8080/api/'

export function getTables() {
  const URL = ENDPOINT + 'tables'
  return http.get(URL, { headers: authHeader() }).then((response) => {
    return response.data
  })
}
