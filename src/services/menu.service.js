import http from "../http-common";
import authHeader from './auth-header'
class MenuDataService{

    getMenu(id) {
        return http.get(`/api/bill/${id}`, {headers: authHeader()});
    }
    addToOrder(id) {
        return http.get(`/api/bill/addToOrder/${id}/${id}`,{headers: authHeader()});
    }
    addToBill(id){
        return http.get(`/api/bill/addToBill/${id}/${id}`,{headers: authHeader()});
    }
}

export default new MenuDataService()