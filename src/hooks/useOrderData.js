import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axiosInstance";

const useOrderData = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const params = {}

                const paymentMethods = searchParams.getAll('paymentMethods')
                if (paymentMethods.length) params.paymentMethods = paymentMethods

                const status = searchParams.getAll('status')
                if (status.length) params.status = status

                if (searchParams.get('admin')) params.admin = searchParams.get('admin')
                if (searchParams.get('carInfo')) params.carInfo = searchParams.get('carInfo')
                if (searchParams.get('location')) params.location = searchParams.get('location')
                if (searchParams.get('deposit')) params.deposit = searchParams.get('deposit')
                if (searchParams.get('totalPrice')) params.totalPrice = searchParams.get('totalPrice')
                if (searchParams.get('customerId')) params.customerId = searchParams.get('customerId')
                if (searchParams.get('customerInfo')) params.customerInfo = searchParams.get('customerInfo')
                if (searchParams.get('contract')) params.contract = searchParams.get('contract')

                console.log("Query params sent:", params); // Debug
                const res = await api.get("/admins/orders", { params });
                setOrders(res.data.orders || []);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, [location.search])

    return { orders, loading };
}

export default useOrderData;