
import axiosInstance from "../Interceptor/axiosInterceptor";
const API = import.meta.env.VITE_API_URL
const promotionsService = {
    addDeal: async (data) => {
        const response = await axiosInstance.post(`${API}/api/addDeal`, data);
        return response;
    },
    updateDeal: async (id, data) => {
        const response = await axiosInstance.put(`${API}/api/updateDeal/${id}`, data);
        return response;
    },
    deleteDeal: async (id) => {
        const response = await axiosInstance.delete(`${API}/api/deleteDeal/${id}`);
        return response;
    },
    getDeals: async () => {
        const response = await axiosInstance.get(`${API}/api/getDeals`);
        return response;
    },
    getDealById: async (id) => {
        const response = await axiosInstance.get(`${API}/api/getDealById/${id}`);
        return response;
    },
    updateDealStatus: async (id) => {
        const response = await axiosInstance.put(`${API}/api/updateDealStatus/${id}`);
        return response;
    },

    // -------------Launch Section ------------------
    addLaunch: async (data) => {
        const response = await axiosInstance.post(`${API}/api/addLaunch`, data);
        return response;
    },
    updateLaunch: async (id, data) => {
        const response = await axiosInstance.put(`${API}/api/updateLaunch/${id}`, data);
        return response;
    },
    deleteLaunch: async (id) => {
        const response = await axiosInstance.delete(`${API}/api/deleteLaunch/${id}`);
        return response;
    },
    getLaunches: async () => {
        const response = await axiosInstance.get(`${API}/api/getLaunches`);
        return response;
    },
    getLaunchById: async (id) => {
        const response = await axiosInstance.get(`${API}/api/getLaunchById/${id}`);
        return response;
    },
    updateLaunchStatus: async (id) => {
        const response = await axiosInstance.put(`${API}/api/updateLaunchStatus/${id}`);
        return response;
    },
}

export default promotionsService