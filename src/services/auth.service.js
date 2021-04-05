import http from "../http-common";

class AuthService {
    login(username, password) {
        return http
            .post("/auth/signin", {
                username,
                password
            })
            .then(response => {
                if (response.data.accessToken) {
                    sessionStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        sessionStorage.removeItem("user");
    }

    register(username, email, password) {
        return http.post("/auth/signup", {
            username,
            email,
            password
        });
    }

    getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('user'));
    }
}

export default new AuthService();
