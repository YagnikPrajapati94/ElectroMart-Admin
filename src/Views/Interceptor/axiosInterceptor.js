import axios from 'axios'
import NProgress from '../Layout/Component/progressBar'
const API = import.meta.env.VITE_API_URL


const axiosInstance = axios.create({
    baseURL: API,
    withCredentials: true
})

axiosInstance.interceptors.request.use(
    (config) => {
        NProgress.start()
        return config
    },
    (error) => {
        NProgress.done();
        return Promise.reject(error)
    }
)



axiosInstance.interceptors.response.use(
    (response) => {
        NProgress.done();
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Always stop bar on error
        NProgress.done();

        // If no response (network error) → stop and reject
        if (!error.response) {
            return Promise.reject(error);
        }

        // If not 401 → stop
        if (error.response.status !== 401) {
            return Promise.reject(error);
        }

        // 🔥 Prevent retry loop if refresh token API gives 401
        if (originalRequest.url.includes("/refreshToken")) {
            return Promise.reject(error);
        }

        // Avoid infinite loop
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            // 🔥 Attempt refresh
            await axiosInstance.post("/api/refreshToken");

            // 🔥 Retry original request
            return axiosInstance(originalRequest);

        } catch (err) {
            // Refresh failed → logout user flow (optional)
            // window.location.href = "/login";

            return Promise.reject(err);
        }
    }
);

export default axiosInstance


