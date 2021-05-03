import http from "../http-common";
import authHeader from "./auth-header";

class BarDataService {
    getAll(){
        return http.get("/bares");
    }

    getAllWithCapacity(location) {
        return http.post("/bar/capacity", location, {headers: authHeader()})
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

    searchBars(text, location){
        return http.post("/bar/search/" + text, location ,{headers: authHeader()})
    }
}

export default new BarDataService();