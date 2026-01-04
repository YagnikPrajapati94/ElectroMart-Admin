
import axiosInstance from "../Interceptor/axiosInterceptor";
const API = import.meta.env.VITE_API_URL
const AttributeService = {
    addAttribute: async (data) => {
        const response = await axiosInstance.post(`${API}/api/addAttribute`, data);
        return response;
    },
    getAttributes: async () => {
        const response = await axiosInstance.get(`${API}/api/getAllAttributes`);
        return response;
    },
    getAttributeByCategory: async (id) => {
        const response = await axiosInstance.get(`${API}/api/getAttributeByCategory/${id}`);
        return response;
    },
}

export default AttributeService