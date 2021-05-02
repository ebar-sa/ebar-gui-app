import http from "../http-common";
import authHeader from './auth-header'
class BarTableDataService{

    getBarTable(id) {
        return http.get(`/tables/tableDetails/${id}`,{headers: authHeader()});
    }
    getBarTableClient(username) {
        return http.get(`/tables/tableClient/${username}`,{headers: authHeader()});
    }
    updateBarTableStateToFree(id) {
        return http.get(`/tables/freeTable/${id}`,{headers: authHeader()});
    }
    updateBarTableStateToBusy(id){
        return http.get(`/tables/busyTable/${id}`,{headers: authHeader()});
    }

    ocupateBarTableByToken(token,barId) {
        return http.get(`/tables/autoOccupateTable/${token}/${barId}`,{headers: authHeader()});
    }
    createBarTable(barId,table) {
        return http.post(`/tables/createTable/${barId.id}`,table, {headers: authHeader()});
    }
    removeBarTable(idBar,tableId) {
        return http.delete(`/tables/deleteTable/${idBar}/${tableId}`, { headers: authHeader()});
    }
    updateBarTable(id,table) {
        return http.post(`/tables/updateTable/${id}`,table,{headers: authHeader()});
    }
    refreshBillAndOrder(id){
        return http.get(`/tables/tableBillRefresh/${id}`, {headers: authHeader()});
    }
    disableBarTable(tableId) {
        return http.get(`/tables/disableTable/${tableId}`, { headers: authHeader()});
    }
    enableBarTable(tableId) {
        return http.get(`/tables/enableTable/${tableId}`, { headers: authHeader()});
    }
}


export default new BarTableDataService();