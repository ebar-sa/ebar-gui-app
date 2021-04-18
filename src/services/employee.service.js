import http from "../http-common";
import authHeader from './auth-header'

class EmployeeDataService {
    getEmployees(idBar) {
        return http.get(`/bar/${idBar}/employees`, {headers: authHeader()});
    }

    getEmployeeByUsername(idBar, user){
        return http.get(`/bar/${idBar}/employees/${user}`, {headers: authHeader()});
    }

    deleteEmployee(idBar, user){
        return http.delete(`/bar/${idBar}/employees/delete/${user}`, {headers: authHeader()});
    }
}

export default new EmployeeDataService()