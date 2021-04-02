import http from "../http-common";
import authHeader from "./auth-header";

class MenuDataService {

    getMenu(idBar) {
        return http.get(`/${idBar}/menu`, {headers: authHeader()})
    }

} 

export default new MenuDataService();