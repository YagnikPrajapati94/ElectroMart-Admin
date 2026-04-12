import axiosInstance from "../Interceptor/axiosInterceptor";
const API = import.meta.env.VITE_API_URL;

const OrderService = {
    // Get all orders (with stats)
    getAllOrders: async () => {
        const response = await axiosInstance.get(`${API}/api/getAllOrders`);
        return response;
    },

    // Update order status
    updateOrderStatus: async (id, orderStatus) => {
        const response = await axiosInstance.patch(
            `${API}/api/updateOrderStatus/${id}`,
            { orderStatus }
        );
        return response;
    },

    // Get all payments
    getAllPayments: async () => {
        const response = await axiosInstance.get(`${API}/api/getAllPayments`);
        return response;
    },
};

export default OrderService;