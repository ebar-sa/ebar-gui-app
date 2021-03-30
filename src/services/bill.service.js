import http from "../http-common";
import authHeader from './auth-header'

class BillDataService {
    getBill(id) {
        return http.get(`/bill/${id}`, {headers: authHeader()});
    }
    addToOrder(idBill, idItem) {
        return http.get(`/bill/addToOrder/${idBill}/${idItem}`,{headers: authHeader()});
    }
    addToBill(idBill, idItem){
        return http.get(`/bill/addToBill/${idBill}/${idItem}`,{headers: authHeader()});
    }
    addToOrderUser(amount, idBill, idItem) {
        return http.get(`/bill/user/addToOrder/${amount}/${idBill}/${idItem}`,{headers: authHeader()});
    }
}

export default new BillDataService()