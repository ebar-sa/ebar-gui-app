import http from "../http-common";
import authHeader from './auth-header'

class EmployeeDataService {
    getEmployees(idBar) {
        return http.get(`/bar/${idBar}/employees`, {headers: authHeader()});
    }

    getEmployeeByUsername(idBar, username){
        return http.get(`/bar/${idBar}/employees/${username}`, {headers: authHeader()});
    }
}

export default new EmployeeDataService()