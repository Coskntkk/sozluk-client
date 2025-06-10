import axios from 'axios';
const apiUrl = "http://localhost:5050"

// Axios instance oluşturun
const api = axios.create({
    baseURL: `${apiUrl}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage?.getItem('token');
        if (token) {
            config.headers["x-access-token"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        localStorage.setItem("token", response.headers["x-access-token"]);
        return response;
    },
    (error) => {
        // if (error.response.data.message === "Invalid Access Token") {
        //     const token = localStorage.getItem('reftoken');
        //     AuthServices.refresh(token)
        //         .then((response) => {
        //             localStorage.setItem("token", response.data.accessToken)
        //             localStorage.setItem("reftoken", response.data.refreshToken)
        //             axios.defaults.headers.authorization = response.data.accessToken;
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //             localStorage.removeItem("token");
        //             localStorage.removeItem("reftoken");
        //             window.location.reload();
        //         })
        // }
        return Promise.reject(error);
    }
);
export default api;
