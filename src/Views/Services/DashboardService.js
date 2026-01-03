
import axiosInstance from "../Interceptor/axiosInterceptor";
const API = import.meta.env.VITE_API_URL
const DashboardService = {
    getCounts: async () => {
        const response = await axiosInstance.get(`${API}/api/dashboard/counts`);
        return response;
    }
}

export default DashboardService