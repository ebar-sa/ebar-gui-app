import http from "../http-common";
import authHeader from './auth-header';

class VotingDataService {
    getVotingsByBarId = (barId) => {
    return new Promise((resolve, reject) => {
        http.get('/bar/' + barId + '/voting', { headers: authHeader() })
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


    vote = async (barId ,votingId, optionId, token, tableToken) =>{
        return http.post("/bar/"+ barId +"/voting/" + votingId + "/option/" + optionId + "/vote", tableToken , {
                headers:
                {
                    "Authorization": "Bearer "+ token
                }
            }).catch(() => {
                return false
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
        return http.post('/bar/' +barId +'/voting', object, { headers: authHeader() })
    }

    updateVoting = (barId, votingId, object) => {
        return http.put('/bar/'+barId+'/voting/'+votingId, object,  {headers: authHeader()})
    }
}

export default new VotingDataService()