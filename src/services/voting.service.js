import axios from "axios";

const API_URL = "http://localhost:8080/api/";


class VotingDataService {

    vote(votingId, optionId, token){
        return axios
        .post(API_URL + "voting/"+ votingId + "/option/"+ optionId + "/vote")
    }
    

    getVoting = async (votingId, token) =>  {
        return axios
            .get(API_URL + "voting/"+ votingId +"/", {
                headers: 
                    {
                    "Authorization": "Bearer "+ token,
                    "Access-Control-Allow-Origin" : "*"
                    }
                })
            .catch(error =>{
                console.log("This:" + error)
            })
            .then(response => {
                if(response){
                    return response.data
                }
            })
    }

}

export default new VotingDataService();