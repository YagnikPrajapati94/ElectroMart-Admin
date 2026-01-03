
import axiosInstance from "../Interceptor/axiosInterceptor";
const API = import.meta.env.VITE_API_URL
const UserService = {
    getAllUsers: async () => {
        const response = await axiosInstance.get(`${API}/api/getAllUsers`);
        return response;
    },
}

export default UserService