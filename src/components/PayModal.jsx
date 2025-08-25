import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { useAuth } from "../hooks/useAuth";

const Label = ({ children }) => (
  <label className="block text-sm text-gray-500 mb-1">{children}</label>
);

const PayModal = ({ open, onClose, order, onAddPayment, onFail, onRefresh = () => {} }) => {
  const { user } = useAuth();
  const totalPrice = Number(order?.totalPrice || 0);
  const defaultDeposit = Number(order?.deposit || 0);
  const isEdit = order?.isEdit || false;

  const [paymentType, setPaymentType] = useState(order?.paymentType || "full");
  const [method, setMethod] = useState("cash");
  const [depositAmount, setDepositAmount] = useState(defaultDeposit);
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    if (order && open) {
      setPaymentType(order.paymentType || "full");
      setDepositAmount(isEdit ? defaultDeposit : 0);
      if (!order._id) {
        console.warn("Invalid order passed to PayModal:", order);
        setError("Invalid order: missing ID");
      }
    }
  }, [order, isEdit, open]);

  useEffect(() => {
    if (!open) {
      setResponse(null);
      setError(null);
      setLoading(false);
      setPaymentType("full");
      setMethod("cash");
      setDepositAmount(defaultDeposit);
      setBankName("");
      setBankAccountNumber("");
      setPaymentDate("");
      setPaymentReference("");
      setQrCodeUrl("");
      setShowConfirmation(false);
      setPaymentId(null);
    }
  }, [open, defaultDeposit]);

  // Removed the useEffect for fetchQrCode as it's redundant; QR is generated on submit if needed

  if (!open) return null;

  if (!order?._id) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
          <div className="errorExplanation bg-red-100 text-red-700 p-3 rounded mb-4">
            Error: Invalid order selected. Please try again.
          </div>
          <button
            className="btn btn-white px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const minDeposit = Math.round(0.3 * totalPrice) || 0;
  const maxDeposit = totalPrice || 0;

  const amountToPay = () => {
    if (!order) return 0;
    return paymentType === "deposit" ? Number(depositAmount) || defaultDeposit : totalPrice;
  };

  const validateDeposit = () => {
    if (paymentType !== "deposit") return true;
    const amount = Number(depositAmount);
    if (isNaN(amount) || amount < minDeposit || amount > maxDeposit) {
      setError(`Deposit must be between $${minDeposit} and $${maxDeposit} (30% to 100% of total)`);
      return false;
    }
    return true;
  };

  const validateBankDetails = () => {
    if (method !== "bank_transfer") return true;
    if (!bankName || !bankAccountNumber) {
      setError("Bank name and account number are required for bank transfer");
      return false;
    }
    return true;
  };

  const handleProceed = async () => {
    setError(null);
    if (!validateDeposit() || !validateBankDetails()) return;

    try {
      setLoading(true);
      const amount = paymentType === "deposit" ? Number(depositAmount) : totalPrice;

      if (isEdit) {
        await axios.patch(
          `/customers/orderss/${order._id}/deposit`, 
          { deposit: amount },
          { headers: { Authorization: `Bearer ${user.accessToken}` } }
        );
        await axios.patch(
          `/customers/orderss/${order._id}/paymentmethod`, 
          { paymentMethod: method },
          { headers: { Authorization: `Bearer ${user.accessToken}` } }
        );
      } else {
        const payload = {
          orderId: order._id,
          paymentMethod: method,
          paymentType,
          amount, // Added to ensure amount is sent
        };

        const { data } = await axios.post(
          `/customers/payment`,
          payload,
          { headers: { Authorization: `Bearer ${user.accessToken}` } }
        );

        setPaymentId(data.payment._id);
        setResponse(data);
      }

      onRefresh(); // Refresh orders after success
      setShowConfirmation(true);
    } catch (err) {
      console.error("Error in handleProceed:", err);
      setError(err.response?.data?.message || "Server error");
      onFail(order._id, null);
      setShowConfirmation(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      setError(null);
      await axios.post(
        `/customers/payments/cancel`,
        { paymentId },
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      setResponse({ ...response, status: "failed" });
      await onFail(order._id, paymentId);
      onRefresh(); // Refresh after cancel
      setQrCodeUrl("");
    } catch (err) {
      console.error("Error in handleCancel:", err);
      setError(err.response?.data?.message || "Failed to cancel payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="modal-header flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
          <h4 className="modal-title text-xl font-semibold">
            {isEdit ? "Edit Payment" : "Pay Order"} #{order._id.slice(-8)}
            <div>
              <small className="text-sm text-gray-500">
                Payment total: ${amountToPay()?.toFixed(2)}
              </small>
            </div>
          </h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="errorExplanation bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {!showConfirmation ? (
            <div id="general_payment_fields">
              <div className="mb-4">
                <Label>Payment Type</Label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="form-control w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  data-cy="payment_type_select"
                  disabled={loading || isEdit}
                >
                  <option value="deposit">Deposit</option>
                  <option value="full">Full (${totalPrice.toFixed(2)})</option>
                </select>
              </div>

              {paymentType === "deposit" && (
                <div className="mb-4">
                  <Label>Deposit Amount</Label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="form-control w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter deposit amount"
                    min={minDeposit}
                    max={maxDeposit}
                    disabled={loading}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Must be between ${minDeposit} and ${maxDeposit} (30% to 100% of total)
                  </div>
                </div>
              )}

              <div className="mb-4">
                <Label>Payment Method</Label>
                <select
                  value={method}
                  onChange={(e) => {
                    setMethod(e.target.value);
                    if (e.target.value !== "qr") setQrCodeUrl("");
                  }}
                  className="form-control w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  data-cy="payment_select"
                  disabled={loading}
                >
                  <option value="">-- Select Payment Method --</option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="qr">QR Code</option>
                </select>
              </div>

              {method === "bank_transfer" && (
                <div id="bank_transfer_details" className="mb-4">
                  <div className="mb-4">
                    <Label>Bank Name</Label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="form-control w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Enter bank name"
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-4">
                    <Label>Bank Account Number</Label>
                    <input
                      type="text"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      className="form-control w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Enter bank account number"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {(method === "cash" || method === "bank_transfer") && (
                <div id="in_house_payment_options" className="mb-4">
                  <div className="mb-4">
                    <Label>Payment Date</Label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="form-control w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      data-cy="dp_payment_paid_at"
                      disabled={loading}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Optional. The current date and time will be used if unset.
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label>Payment Reference</Label>
                    <input
                      type="text"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      className="form-control w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="e.g., check number"
                      disabled={loading}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Optional. A reference value for reporting (e.g., check number).
                    </div>
                  </div>
                </div>
              )}

              {/* Removed pre-generated QR display as it's handled in response */}
            </div>
          ) : (
            <div>
              <Label>Confirmation</Label>
              <div className="mt-3">
                <div className="mb-2">
                  Selected: <strong>{paymentType}</strong> • Method: <strong>{method}</strong>
                  {paymentType === "deposit" && (
                    <span> • Amount: <strong>${amountToPay()?.toFixed(2)}</strong></span>
                  )}
                  {response?.status && (
                    <span> • Status: <strong>{response.status}</strong></span>
                  )}
                </div>

                {method === "qr" && response?.qrData?.qrCode && (
                  <div className="p-3 border border-gray-300 rounded mb-4">
                    <div className="mb-2">
                      Scan this QR to pay (expires {new Date(response.qrData.expiryTime).toLocaleTimeString()})
                    </div>
                    <img src={response.qrData.qrCode} alt="QR Code" className="w-48 h-48 object-contain" />
                  </div>
                )}

                {method === "bank_transfer" && (
                  <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4">
                    <p>
                      <strong>Alert</strong>
                      This does not charge a bank account. Please transfer ${amountToPay()?.toFixed(2)} to:
                      <br />
                      Bank: <strong>{bankName}</strong>
                      <br />
                      Account Number: <strong>{bankAccountNumber}</strong>
                    </p>
                  </div>
                )}

                {method === "cash" && (
                  <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                    <p>
                      <strong>Success</strong>
                      Cash payment of ${amountToPay()?.toFixed(2)} recorded successfully. Status: {response?.status || "deposited"}.
                    </p>
                  </div>
                )}

                {response?.status === "failed" && (
                  <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    <p>
                      <strong>Payment Failed</strong>
                      The payment for order #{order._id.slice(-8)} has been canceled. Status: {response.status}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer flex justify-end gap-2 pt-4 border-t border-gray-200">
          {loading && (
            <div className="spinner w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
          )}
          <button
            className="btn btn-white px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-gray-700"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
          {!showConfirmation ? (
            <button
              className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleProceed}
              disabled={loading || !method}
            >
              Submit
            </button>
          ) : (
            (method === "qr" || method === "bank_transfer") && response?.status !== "failed" && (
              <button
                className="btn btn-danger px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel Payment
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PayModal;