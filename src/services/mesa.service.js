import http from "../http-common";
import authHeader from './auth-header'
class BarTableDataService{

    getBarTable(id) {
        return http.get(`/tables/tableDetails/${id}`);
    }
    updateBarTableStateToFree(id) {
        return http.get(`/tables/freeTable/${id}`,{headers: authHeader()});
    }
    updateBarTableStateToBusy(id){
        return http.get(`/tables/busyTable/${id}`,{headers: authHeader()});
    }
}


export default new BarTableDataService();