import http from "../http-common";
import authHeader from './auth-header'
class MenuDataService{

    getBarMenu(id) {
        return http.get(`/menu/${id}`, {headers: authHeader()});
    }
}

export default new MenuDataService()