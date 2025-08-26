import React, { useState, useEffect } from "react";
import axios from "../../api/axiosInstance";
import PayModal from "../../components/PayModal";
import { useAuth } from "../../hooks/useAuth";
import PaymentPanel from "../../components/PaymentPanel";

const PaymentPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/customers/payments", {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      const fetchedOrders = response.data.data || [];
      setOrders(fetchedOrders.filter((order) => order._id && order.totalPrice !== undefined));
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleAddPayment = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleAddPaymentSubmit = async (orderId, paymentMethod, paymentType, amount) => {
    try {
      const order = orders.find((o) => o._id === orderId);
      if (!order) throw new Error("Order not found");
      const totalPrice = Number(order.totalPrice || 0);
      const finalAmount = paymentType.toLowerCase() === "deposit" ? Number(amount || order.deposit) : Number(totalPrice);

      if (paymentType === "deposit" && (finalAmount < 0.3 * totalPrice || finalAmount > totalPrice)) {
        throw new Error("Deposit must be at least 30% of totalPrice and not exceed totalPrice");
      }

      const payload = {
        orderId,
        paymentMethod,
        paymentType,
        amount: finalAmount, // ensure backend receives it
      };

      console.log("Submitting payment:", payload);
      await axios.post(
        `/customers/payment`,
        payload,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );

      await fetchOrders();
      setModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error("Error adding payment:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to add payment");
    }
  };

  if (!user) return <main className="max-w-5xl mx-auto p-6">Please log in to view your payments.</main>;
  if (loading) return <main className="max-w-5xl mx-auto p-6">Loading payments...</main>;
  if (error) return <main className="max-w-5xl mx-auto p-6 text-red-500">{error}</main>;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-1">Payments</h1>
      <p className="text-lg text-gray-700 mb-6">Hello, {user.name || "Customer"}</p>

      <div className="bg-white rounded shadow p-6">
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders with payments found.</p>
        ) : (
          orders.map((order) => (
            <PaymentPanel
              key={order._id}
              order={order}
              onAddPayment={handleAddPayment}
              showDeleted={showDeleted}
              toggleShowDeleted={() => setShowDeleted(!showDeleted)}
              onRefresh={fetchOrders}
            />
          ))
        )}
        <div className="text-sm text-gray-500 mt-4 hidden sm:block">
          <i className="far fa-eye mr-1"></i>
          Indicates viewable by customers
        </div>
      </div>

      <PayModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onAddPayment={handleAddPaymentSubmit}
        onRefresh={fetchOrders}
      />
    </main>
  );
};

export default PaymentPage;