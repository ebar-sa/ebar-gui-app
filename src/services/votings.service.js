import axios from "axios";
import authHeader from './auth-header';

const API_URL = "http://localhost:8080/api/";


class VotingDataService {
    getVotingsByBarId = () => {
    return new Promise((resolve, reject) => {
        axios.get(API_URL + 'bar/1/voting', { headers: authHeader() })
        .then(res => {
            resolve(res.data)
        })
        .catch(error => {
            console.log('Error', error)
            reject(error)
        }
            );
    })
    }


    vote = async (votingId, optionId, token) =>{
        axios
            .post(API_URL + "voting/" + votingId + "/option/" + optionId + "/vote", {}, {
                headers:
                {
                    "Authorization": "Bearer "+ token
                }
            })
        }


    getVoting = async (votingId, token) => {
        return axios
            .get(API_URL + "voting/" + votingId + "/", {
                headers:
                {
                    "Authorization": "Bearer " + token,
                    "Access-Control-Allow-Origin": "*"
                }
            })
            .catch(error => {
                console.log("This:" + error)
            })
            .then(response => {
                if (response) {
                    return response.data
                }
            })
    }

}

export default new VotingDataService()