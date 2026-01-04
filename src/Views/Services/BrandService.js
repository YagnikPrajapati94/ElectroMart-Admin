
import axiosInstance from "../Interceptor/axiosInterceptor";
const API = import.meta.env.VITE_API_URL
const BrandService = {
    addBrand: async (data) => {
        const response = await axiosInstance.post(`${API}/api/addBrand`, data);
        return response;
    },
    deleteBrand: async (id) => {
        const response = await axiosInstance.delete(`${API}/api/deleteBrand/${id}`);
        return response;
    },
    getBrandById: async (id) => {
        const response = await axiosInstance.get(`${API}/api/getBrandById/${id}`);
        return response;
    },
    updateBrand: async (id, data) => {
        const response = await axiosInstance.put(`${API}/api/updateBrand/${id}`, data);
        return response;
    },
    getBrandsDropdown: async () => {
        const response = await axiosInstance.get(`${API}/api/getBrandsDropdown`);
        return response;
    },
}

export default BrandService