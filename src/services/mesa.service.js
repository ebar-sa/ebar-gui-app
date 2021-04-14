import http from "../http-common";
import authHeader from './auth-header'
class BarTableDataService{

    getBarTable(id) {
        return http.get(`/tables/tableDetails/${id}`,{headers: authHeader()});
    }
    updateBarTableStateToFree(id) {
        return http.get(`/tables/freeTable/${id}`,{headers: authHeader()});
    }
    updateBarTableStateToBusy(id){
        return http.get(`/tables/busyTable/${id}`,{headers: authHeader()});
    }

    ocupateBarTableByToken(id,token) {
        return http.get(`/tables/autoOccupateTable/${id}/${token}`,{headers: authHeader()});
    }
    createBarTable(barId,table) {
        return http.post(`/tables/createTable/${barId.id}`,table, {headers: authHeader()});
    }
    removeBarTable(idBar,tableId) {
        return http.post(`/tables/deleteTable/${idBar}/${tableId}`, { headers: authHeader()});
    }
    updateBarTable(id,table) {
        return http.post(`/tables/updateTable/${id}`,table,{headers: authHeader()});
    }
}


export default new BarTableDataService();