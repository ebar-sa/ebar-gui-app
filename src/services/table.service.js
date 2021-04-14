import http from "../http-common";
import authHeader from "./auth-header";

export default class BarTableDataService{

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
    removeBarTable(id) {
        return http.post(`/tables/deleteTable/${id}`, {headers: authHeader()});
    }
    updateBarTable(id,table) {
        return http.post(`/tables/updateTable/${id}`,table,{header: authHeader()});
    }
    getTableDetails(id) {
        return http.get(`/table-details/${id}`, {headers:authHeader()});
    }
}