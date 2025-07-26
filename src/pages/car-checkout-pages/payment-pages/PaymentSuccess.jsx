// PaymentSuccess.jsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const confirmPayment = async () => {
      if (sessionId) {
        try {
          await axios.get(`/payment/confirm?session_id=${sessionId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
        } catch (err) {
          console.error("Payment confirmation failed:", err);
        }
      }
    };
    confirmPayment();
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful</h1>
      <p className="text-gray-600 dark:text-white mb-6">Thank you for your payment</p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/category")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Continue shopping
        </button>
        <button
          onClick={() => navigate("/orders")}
          className="bg-gray-200 dark:bg-gray-700 dark:text-white px-6 py-3 rounded-lg"
        >
          Order Tracking
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;