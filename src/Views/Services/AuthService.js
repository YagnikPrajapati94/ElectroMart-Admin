
import axiosInstance from "../Interceptor/axiosInterceptor";


const API = import.meta.env.VITE_API_URL
const AuthSerivce = {
    adminLogin: async (data) => {
        const response = await axiosInstance.post(`${API}/api/adminLogin`, data);
        return response;
    },
    getMe: async () => {
        const response = await axiosInstance.get(`${API}/api/getAdmin`);
        return response;
    },
    logout: async () => {
        const response = await axiosInstance.post(`${API}/api/logout`);
        return response;
    }
}

export default AuthSerivce