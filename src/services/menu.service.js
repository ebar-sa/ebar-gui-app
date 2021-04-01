import http from "../http-common";
import authHeader from './auth-header'
class MenuDataService{

    getBarMenu(id) {
        return http.get(`/menu/${id}`, {headers: authHeader()});
    }
    /*
    getMenu(idBar) {
        return http.get(`/${idBar}/menu`, {headers: authHeader()})
    }
    */
    getMenu() {
        return http.get(`/menuAdmin`, {headers: authHeader()})
    }
}

export default new MenuDataService()