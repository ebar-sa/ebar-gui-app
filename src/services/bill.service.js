import http from "../http-common";
import authHeader from './auth-header'

class BillDataService {
    getBill(id) {
        return http.get(`/bill/${id}`, {headers: authHeader()});
    }
    addToOrder(idBill, idItem) {
        return http.get(`/bill/addToOrder/${idBill}/${idItem}`,{headers: authHeader()});
    }
    addToBill(idBill, idItemBill){
        return http.get(`/bill/addToBill/${idBill}/${idItemBill}`,{headers: authHeader()});
    }
    addToOrderUser(amount, idBill, idItem) {
        return http.get(`/bill/user/addToOrder/${amount}/${idBill}/${idItem}`,{headers: authHeader()});
    }
    addAllToBill(idBill, idItemBill){
        return http.get(`/bill/addAllToBill/${idBill}/${idItemBill}`,{headers: authHeader()});
    }
    addAmountToOrder(idBill, idItem, amount) {
        return http.get(`/bill/addAmountToOrder/${idBill}/${idItem}/${amount}`,{headers: authHeader()});
    }
}

export default new BillDataService()