import http from "../http-common";

class BarTableService {
    getAll(){
        return http.get("/bill");
    }
}

export default new BarTableService();