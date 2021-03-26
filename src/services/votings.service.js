import axios from "axios";
import authHeader from './auth-header';

const API_URL = "http://localhost:8080/api/votacion/bar/";

class VotationDataService {
    getVotations = () => {
    return new Promise((resolve, reject) => {
        axios.get(API_URL + '1', { headers: authHeader() })
        .then(res => {
            resolve(res.data)
        })
        .catch(error => reject(error));
    })
    }
}

export default new VotationDataService()