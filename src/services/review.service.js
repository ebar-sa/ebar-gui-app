import http from "../http-common";
import authHeader from './auth-header'

class ReviewDataService {

    createReview = (data) => {
        return http.post("/reviews", data, {headers: authHeader()})
    }

    getAvailableItemsToReview = (token) => {
        return http.get(`/reviews/${token}`, {headers: authHeader()});
    }
}

export default new ReviewDataService()