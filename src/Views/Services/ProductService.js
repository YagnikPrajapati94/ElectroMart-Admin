
import axiosInstance from "../Interceptor/axiosInterceptor";
const API = import.meta.env.VITE_API_URL
const ProductService = {
    addProduct: async (data) => {
        const response = await axiosInstance.post(`${API}/api/addProduct`, data);
        return response;
    },
    updateProduct: async (id, data) => {
        const response = await axiosInstance.put(`${API}/api/updateProduct/${id}`, data);
        return response;
    },
    deleteProduct: async (id) => {
        const response = await axiosInstance.delete(`${API}/api/deleteProduct/${id}`);
        return response;
    },
    getProductById: async (id) => {
        const response = await axiosInstance.get(`${API}/api/getProductById/${id}`);
        return response;
    },
    getAllProductsTableData: async () => {
        const response = await axiosInstance.get(`${API}/api/getAllProductsTableData`);
        return response;
    },
}

export default ProductService