import http from "../http-common"

export function login({username, password}) {
    return http
        .post("/auth/signin", {
            username,
            password
        })
        .then(response => {
            return response.data;
        });
}


export function register({username, email, password}) {
    return http
        .post("/auth/signup", {
            username,
            email,
            password,

        })
        .then(response => {
            return response.data;
        });
}

export function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('user'));
}