import http from "../http-common";
import authHeader from './auth-header'

export function createEmployees(idBar, {username, email, roles, password, firstName, lastName, dni, phoneNumber}) {
    return http
        .post(`/bar/${idBar}/employees/create`, {
            username,
            email,
            roles,
            password,
            firstName,
            lastName,
            dni,
            phoneNumber
        },  {headers: authHeader()})
        .then(response => {
            return response.data;
        });
}