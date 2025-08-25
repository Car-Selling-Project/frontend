import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useAuth } from "../../hooks/useAuth";
import OrderDetail from "./OrderDetail";
import { StarRating } from "../car-browsing-pages/Details";

// ---- Helpers ----
const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n || 0));

const badgeBase = "px-3 py-1 rounded-full text-xs font-semibold ring-1 inline-flex items-center justify-center";
const cGreen = "bg-green-100 text-green-700 ring-green-200";
const cAmber = "bg-amber-100 text-amber-700 ring-amber-200";
const cRed = "bg-red-100 text-red-700 ring-red-200";

const pill = (text, color) => <span className={`${badgeBase} ${color}`} key={text}>{text}</span>;

const orderStatusPill = (status) => {
  const s = (status || "").toLowerCase();
  if (["completed", "success", "succeeded"].includes(s)) return pill("Completed", cGreen);
  if (["canceled", "cancelled", "failed"].includes(s)) return pill("Canceled", cRed);
  if (["confirmed"].includes(s)) return pill("Confirmed", cGreen);
  return pill("Pending", cAmber);
};

const paymentStatusPill = (status) => {
  const s = (status || "").toLowerCase();
  if (["paid", "succeeded", "success"].includes(s)) return pill("Paid", cGreen);
  if (["failed", "canceled", "cancelled"].includes(s)) return pill("Failed", cRed);
  if (["deposited"].includes(s)) return pill("Deposited", cAmber);
  return pill("Pending", cAmber);
};

const contractStatusPill = (status) => {
  const s = (status || "").toLowerCase();
  if (["signed"].includes(s)) return pill("Signed", cGreen);
  if (["partial"].includes(s)) return pill("Partial", cAmber);
  return pill("Pending", cAmber);
};

const OrderTracking = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("/customers/orderss", {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
        console.log("API Response:", res.data); // Debug response
        const fetchedOrders = res.data?.data || [];
        // Log orders with missing IDs for debugging
        fetchedOrders.forEach((order, index) => {
          if (!order.id) {
            console.warn(`Order at index ${index} has no valid ID:`, order);
          }
        });
        setOrders(fetchedOrders.filter((order) => order.id && order.data));
      } catch (err) {
        console.error("Failed to fetch orders:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) return <main className="max-w-5xl mx-auto p-6">Please log in to view your orders.</main>;
  if (loading) return <main className="max-w-5xl mx-auto p-6">Loading orders...</main>;
  if (error) return <main className="max-w-5xl mx-auto p-6 text-red-500">{error}</main>;

  return (
    <main className="max-w-5xl mx-auto p-6">
      {/* PAGE HEADER */}
      <h1 className="text-3xl font-bold mb-1">Order</h1>
      <p className="text-lg text-gray-700 mb-6">Hello, {user.fullName || "Customer"}</p>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) => {
          // Skip orders with no valid ID or data
          if (!order.id || !order.data) {
            return null;
          }
          const shortId = order.id.slice(-8);
          const qty = Number(order.data.quantity || 1);
          const unitPrice = Number(order.data.carInfo?.price || 0);
          const subtotal = unitPrice * qty;
          const tax = subtotal * 0.1; // 10% tax as per InfoFilling
          const registrationFee = 500; // Fixed as per InfoFilling
          const insuranceFee = 300; // Fixed as per InfoFilling
          const fullPrice = Number(order.data.totalPrice || subtotal + tax + registrationFee + insuranceFee);
          const depositAmount = Number(order.data.deposit || 0);
          const paymentType = order.data.paymentType || (depositAmount > 0 && depositAmount < fullPrice ? "deposit" : "full");

          return (
            <section
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-sm hover:shadow transition cursor-pointer"
              onClick={() => setSelected(order.data)}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-6">
                <div className="space-y-2">
                  <div className="text-base md:text-lg font-bold text-primary">Order #{shortId}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium text-title">Payment Status:</span>
                    {paymentStatusPill(order.data.paymentStatus)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium text-title">Contract Status:</span>
                    {contractStatusPill(order.data.contract?.status)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="tracking-wide text-base text-gray-500 font-semibold">
                    CUSTOMER DETAIL
                  </div>
                  <div className="font-semibold">
                    {order.data.customerInfo?.fullName || "N/A"} - {order.data.customerInfo?.phone || "N/A"}
                  </div>
                  <div className="text-sm text-maintext">
                    <span className="font-medium">Location Deliver</span>: {order.data.location?.name || "N/A"}
                  </div>
                </div>

                <div className="flex md:justify-end">
                  <div className="self-start">{orderStatusPill(order.data.status)}</div>
                </div>
              </div>

              <h3 className="font-bold mb-3 border-t pt-2 text-xl">ORDER SUMMARY</h3>

              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr_auto] gap-4 items-stretch">
                {/* CỘT 1: Ảnh xe */}
                <div className="bg-[#3563E9] rounded-xl p-3 flex items-center justify-center self-stretch min-h-[160px]">
                  <img
                    src={order.data.carInfo?.images?.[0] || "https://via.placeholder.com/360x220"}
                    alt={order.data.carInfo?.title || "Car"}
                    className="w-full h-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* CỘT 2 + CỘT 3 grouped */}
                <div className="flex flex-col justify-between w-full">
                  {/* Top row: car info + contact support */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    {/* Car info */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-xl font-bold">{order.data.carInfo?.title || "N/A"}</p>
                        <StarRating rating={order.data.carInfo?.rating || 0} />
                      </div>
                      <p className="text-subtitle">Quantity: {qty}</p>
                    </div>

                    {/* Contact support button */}
                    <a
                      href="mailto:support@carhunt.com"
                      onClick={(e) => e.stopPropagation()}
                      className="bg-primary text-white uppercase tracking-wide text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 self-start"
                    >
                      CONTACT SUPPORT
                    </a>
                  </div>

                  {/* Bottom row: Price breakdown */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-base">
                      <span>Provisional × {qty}</span>
                      <span>{money(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span>Tax (10%)</span>
                      <span>{money(tax)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span>Registration fee</span>
                      <span>{money(registrationFee)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span>Insurance fee</span>
                      <span>{money(insuranceFee)}</span>
                    </div>

                    <div className="flex justify-between items-center border-t pt-3 mt-3">
                      <h3 className="text-xl font-semibold">Total Price</h3>
                      <h3 className="text-xl font-semibold">{money(fullPrice)}</h3>
                    </div>

                    {paymentType === "deposit" && (
                      <div className="flex justify-between text-md">
                        <span>Deposit</span>
                        <span>{money(depositAmount)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })
      )}

      <OrderDetail
        open={!!selected}
        order={selected}
        onClose={() => setSelected(null)}
      />
    </main>
  );
};

export default OrderTracking;