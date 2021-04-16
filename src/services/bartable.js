import http from "../http-common";
import authHeader from './auth-header'

export function getTables(id) {
  return http.get("/tables/" + id, { headers: authHeader() }).then((response) => {
    return response.data
  })
}
