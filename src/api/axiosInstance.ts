import axios from "axios";
import { generateAppToken } from "../utils/security/appToken";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
let requestInterceptor: number | null = null;
let responseInterceptor: number | null = null;

function getAuthToken() {
    return localStorage.getItem('authToken');
}

export function configureAxios(
    logOut: () => void
) {
    if (requestInterceptor !== null) {
        axiosInstance.interceptors.request.eject(requestInterceptor);
    }
    if (responseInterceptor !== null) {
        axiosInstance.interceptors.response.eject(responseInterceptor);
    }

    const token = getAuthToken();

    if (token) {
        requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                config.headers["Authorization"] = `Bearer ${token}`;
                config.headers["X-App-Token"] = generateAppToken()
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.response && error.response.status === 403) {
                    logOut();
                }
                return Promise.reject(error);
            }
        );
    } else {
        logOut();
    }
}
export default axiosInstance;
