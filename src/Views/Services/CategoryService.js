
import axiosInstance from "../Interceptor/axiosInterceptor";
const API = import.meta.env.VITE_API_URL
const CategoryService = {
    addCategory: async (data) => {
        const response = await axiosInstance.post(`${API}/api/addCategory`, data);
        return response;
    },
    deleteCategory: async (id) => {
        const response = await axiosInstance.delete(`${API}/api/deleteCategory/${id}`);
        return response;
    },
    getCategoryById: async (id) => {
        const response = await axiosInstance.get(`${API}/api/getCategoryById/${id}`);
        return response;
    },
    updateCategory: async (id, data) => {
        const response = await axiosInstance.put(`${API}/api/updateCategory/${id}`, data);
        return response;
    },
    getCategories: async () => {
        const response = await axiosInstance.get(`${API}/api/getCategories`);
        return response;
    },
    getCategoriesDropdown: async () => {
        const response = await axiosInstance.get(`${API}/api/getCategoriesDropdown`);
        return response;
    },
}

export default CategoryService