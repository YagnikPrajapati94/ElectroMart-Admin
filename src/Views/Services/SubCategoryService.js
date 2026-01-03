
import axiosInstance from "../Interceptor/axiosInterceptor";
const API = import.meta.env.VITE_API_URL
const SubCategoryService = {
    addSubCategory: async (data) => {
        const response = await axiosInstance.post(`${API}/api/addSubCategory`, data);
        return response;
    },
    deleteSubCategory: async (id) => {
        const response = await axiosInstance.delete(`${API}/api/deleteSubCategory/${id}`);
        return response;
    },
    getSubCategoryById: async (id) => {
        const response = await axiosInstance.get(`${API}/api/getSubCategoryById/${id}`);
        return response;
    },
    updateSubCategory: async (id, data) => {
        const response = await axiosInstance.put(`${API}/api/updateSubCategory/${id}`, data);
        return response;
    },
    getSubCategories: async () => {
        const response = await axiosInstance.get(`${API}/api/getSubCategories`);
        return response;
    },
}

export default SubCategoryService