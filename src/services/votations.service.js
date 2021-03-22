import axios from "axios";

const API_URL = "http://localhost:8080/api/votacion/bar/";

class VotationDataService {
    getVotations = () => {
    return new Promise((resolve, reject) => {
        axios.get(API_URL+'1')
        .then(res => {
            console.log('Dat', res.data)
            resolve(res.data)
        })
        .catch(error => reject(error));
    })
    }
}

export default new VotationDataService()