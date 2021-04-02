import axios from "axios";

const ENDPOINT = 'http://localhost:8080/api/auth/'

export function login({username, password}) {
  return axios
      .post(ENDPOINT + "signin", {
          username,
          password
      })
      .then(response => {
          return response.data;
      });
}


export function register({username, email, password}) {
    return axios
        .post(ENDPOINT + "signup", {
            username,
            email,
            password,
            
        })
        .then(response => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
  
            return response.data;
        });
  }