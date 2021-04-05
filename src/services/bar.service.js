import http from "../http-common";
import authHeader from "./auth-header";

class BarDataService {
    getAll(){
        return http.get("/bares");
    }

    getAllWithCapacity() {
        return http.get("/bar/capacity", {headers: authHeader()})
    }

    getBar(id) {
        return http.get("/bar/" + id, {headers: authHeader()})
    }
}

export default new BarDataService();