import axios from "axios";
import http from "../http-common";
import authHeader from './auth-header';

class VotingDataService {
    getVotingsByBarId = () => {
    return new Promise((resolve, reject) => {
        http.get('/bar/1/voting', { headers: authHeader() })
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
        http.post("/voting/" + votingId + "/option/" + optionId + "/vote", {}, {
                headers:
                {
                    "Authorization": "Bearer "+ token
                }
            })
        }


    getVoting = async (votingId, token) => {
        return http.get("/voting/" + votingId + "/", {
                headers:
                {
                    "Authorization": "Bearer " + token,
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

    createVoting = (barId, object) => {
        return http.post("/bar/1/voting", object, { headers: authHeader() })
    }
}

export default new VotingDataService()