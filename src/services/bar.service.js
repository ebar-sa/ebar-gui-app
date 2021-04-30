import http from "../http-common";
import authHeader from "./auth-header";

class BarDataService {
    getAll(){
        return http.get("/bares");
    }

    getAllWithCapacity() {
        return http.get("/bar/capacity", {headers: authHeader()})
    }

    getBarsMap(object) {
        return http.post("/bar/map", object, { headers: authHeader() })
    }

    getBar(id) {
        return http.get("/bar/" + id, {headers: authHeader()})
    }

    createBar(object) {
        return http.post("/bar", object, {headers: authHeader()})
    }

    updateBar(object, barId) {
        return http.put("/bar/" + barId, object, {headers: authHeader()})
    }

    deleteImage(barId, imgId) {
        return http.delete("/bar/" + barId + "/image/" + imgId, {headers: authHeader()})
    }
}

export default new BarDataService();