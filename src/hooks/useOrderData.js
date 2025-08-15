import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axiosInstance";

const useOrderData = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get("/admins/orders");
                setOrders(Array.isArray(response.data.data) ? response.data.data : []);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [location.search]);

    return { orders, loading };
};

export default useOrderData;