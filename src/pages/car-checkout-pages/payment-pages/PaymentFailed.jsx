import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Failed</h1>
      <p className="text-gray-600 dark:text-white mb-6">Please try again or return to homepage</p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/checkout")}
          className="bg-red-600 text-white px-6 py-3 rounded-lg"
        >
          Retry
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-200 dark:bg-gray-700 dark:text-white px-6 py-3 rounded-lg"
        >
          Return to homepage
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;