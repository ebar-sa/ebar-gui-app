import http from "../http-common";

export default class TableDataService{

    getTableDetails(id) {
        return http.get(`/table-details/${id}`);
    }
}