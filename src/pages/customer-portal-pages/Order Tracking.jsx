import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useAuth } from "../../hooks/useAuth";
import { StarRating } from "../car-browsing-pages/Details";

const OrderTracking = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) return <p>Please log in to view your orders.</p>;
  if (loading) return <p>Loading orders...</p>;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Order Tracking</h1>
      <p className="text-xl font-semibold mb-6">Hello, {user.fullName}</p>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <p className="text-gray-500">Order #{order._id.slice(-8)}</p>
                <p className="text-sm text-green-600 font-semibold">{order.status}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">${order.car.price.discounted.toFixed(2)}</p>
                <p className="text-sm text-green-500">Paid</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={order.car.image}
                alt={order.car.name}
                className="w-48 h-32 object-contain rounded"
              />
              <div>
                <h2 className="text-2xl font-bold">{order.car.name}</h2>
                <StarRating rating={order.car.rating} />
                <p className="mt-2">
                  <strong>Billing:</strong> {order.billingInfo.fullName} – {order.billingInfo.phone}
                </p>
                <p>
                  <strong>Address:</strong> {order.billingInfo.address}, {order.billingInfo.city}
                </p>
                <p className="mt-2">
                  <strong>Pick-up:</strong> {order.rentalInfo.pickUpLocation} on{" "}
                  {order.rentalInfo.pickUpDate} 
                </p>
                <p>
                  <strong>Drop-off:</strong> {order.rentalInfo.dropOffLocation} on{" "}
                  {order.rentalInfo.dropOffDate} 
                </p>
              </div>
            </div>

            <div className="text-right mt-4">
              <a
                href="mailto:support@morent.com"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Contact Support
              </a>
            </div>
          </div>
        ))
      )}
    </main>
  );
};

export default OrderTracking;