import http from "../http-common";
import authHeader from './auth-header'
class MenuDataService{

    getBarMenu(id) {
        return http.get(`/menu/${id}`, {headers: authHeader()});
    }
    
    getMenu(idBar) {
        return http.get(`/bares/${idBar}/menu`, {headers: authHeader()})
    }

    getItem(idBar, idItemMenu) {
        return http.get(`/bares/${idBar}/menu/getItem/${idItemMenu}`, {headers: authHeader()})
    }
    
    createItem(idBar, itemMenu) {
        return http.post(`/bares/${idBar}/menu/itemMenu`, itemMenu, {headers: authHeader()});
    }

    editItem(idBar, idItemMenu, itemMenu) {
        return http.put(`/bares/${idBar}/menu/itemMenu/${idItemMenu}`, itemMenu, {headers: authHeader()})
    }

    deleteItem(idBar, idItemMenu) {
        return http.delete(`/bares/${idBar}/menu/itemMenu/${idItemMenu}/delete`, {headers: authHeader()})
    }

}

export default new MenuDataService() 