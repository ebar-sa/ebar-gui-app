import http from "../http-common";
import authHeader from './auth-header'

export function getTables() {
  return http.get("/tables", { headers: authHeader() }).then((response) => {
    return response.data
  })
}
