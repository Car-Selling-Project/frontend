import React, { useState } from "react";
import { TransactionOutlined } from "@ant-design/icons";
import axios from "../api/axiosInstance";
import { useAuth } from "../hooks/useAuth";

const badgeBase = "px-3 py-1 rounded-full text-xs font-semibold ring-1 inline-flex items-center justify-center";
const cGreen = "bg-green-100 text-green-700 ring-green-200";
const cRed = "bg-red-100 text-red-700 ring-red-200";
const cAmber = "bg-amber-100 text-amber-700 ring-amber-200";

const money = (n) =>
  n === undefined || n === null || isNaN(Number(n))
    ? "N/A"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n));

const paymentStatusPill = (status) => {
  const s = (status || "").toLowerCase();
  if (["paid", "succeeded", "success"].includes(s)) return <span className={`${badgeBase} ${cGreen}`}>Paid</span>;
  if (["failed", "canceled", "cancelled"].includes(s)) return <span className={`${badgeBase} ${cRed}`}>Failed</span>;
  if (["deposited", "deposit"].includes(s)) return <span className={`${badgeBase} ${cGreen}`}>Deposited</span>;
  return <span className={`${badgeBase} ${cAmber}`}>Pending</span>;
};

const PaymentPanel = ({ order, onAddPayment = () => {}, showDeleted = false, toggleShowDeleted, onRefresh = () => {} }) => {
  const { user } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [error, setError] = useState(null);

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  if (!order || !order._id || !order.totalPrice) return null;

  const orderId = order._id;
  const shortId = orderId.slice(-8);
  const totalPrice = Number(order.totalPrice || 0);
  const deposit = Number(order.deposit || 0);
  const totalOutstanding = Math.max(0, totalPrice - deposit);
  const payments = order.payment || [];
  const hasDepositPayment = payments.some((p) => !p.deleted && p.name?.toLowerCase() === "deposit"); // Added to check for existing deposit payment
  const isDepositedOrPaid = ["deposited", "paid"].includes((order.paymentStatus || "").toLowerCase()) || hasDepositPayment; // Updated to consider existing deposit payment

  const handlePay = async () => {
    try {
      setError(null);
      const depositResponse = await axios.patch(
        `/customers/orderss/${orderId}/deposit`, 
        { deposit },
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      await axios.patch(
        `/customers/orderss/${orderId}/paymentmethod`, 
        { paymentMethod: order.paymentMethod || "cash" },
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      onRefresh(); // Refresh orders to update UI
      toggleDropdown(null);
    } catch (error) {
      console.error("Pay failed:", error);
      setError(error.response?.data?.message || "Failed to process payment");
    }
  };

  const handleEdit = () => {
    try {
      setError(null);
      onAddPayment({ ...order, isEdit: true });
      toggleDropdown(null);
    } catch (error) {
      console.error("Edit failed:", error);
      setError("Failed to open edit modal");
    }
  };

  return (
    <section className="mb-6">
      <h3 className="font-semibold flex items-center gap-2 text-lg mb-2">
        <TransactionOutlined /> Payment History for Order #{shortId}
      </h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="panel panel-default border border-gray-200 rounded">
        <div className="panel-heading flex justify-between items-center p-4 bg-gray-50">
          <h3 className="text-lg font-semibold">
            <i className="far fa-file-pdf mr-2"></i>
            Contract & Order: {shortId} — <strong data-cy="amount_due">{money(totalPrice)}</strong>
            <i
              className="far fa-eye ml-2 text-gray-500"
              title="These payments are currently viewable via the Customer Portal."
            ></i>
          </h3>
          <div className="dropdown relative group">
            <button
              className="btn btn-white btn-sm flex items-center text-gray-600 hover:text-blue-600"
              onClick={() => toggleDropdown(`order-${orderId}`)}
            >
              <i className="fas fa-cog mr-1"></i>
              <i className="caret"></i>
            </button>
            <ul
              className={`dropdown-menu absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg ${
                openDropdown === `order-${orderId}` ? "block" : "hidden"
              }`}
            >
              <li>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => onAddPayment(order)}
                >
                  <i className="far fa-money-bill-alt mr-2"></i>
                  Add Payment
                </button>
              </li>
              {!isDepositedOrPaid && (
                <>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handlePay}
                    >
                      <i className="far fa-money-bill-alt mr-2"></i>
                      Pay
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                      onClick={handleEdit}
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Edit
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="panel-body p-0">
          <div className="table-responsive">
            <table className="table table-striped m-0 w-full">
              <thead>
                <tr>
                  <th className="text-sm text-gray-500">Payment</th>
                  <th className="text-sm text-gray-500 text-right">Amount</th>
                  <th className="text-sm text-gray-500 text-center">Status</th>
                  <th className="text-sm text-gray-500">Method</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr className="total-amount-row font-bold bg-white">
                  <td>Grand Total</td>
                  <td className="text-right">{money(totalPrice)}</td>
                  <td className="text-center">{paymentStatusPill(order.paymentStatus)}</td>
                  <td colSpan="2"></td>
                </tr>

                {payments
                  .filter((payment) => showDeleted || !payment.deleted)
                  .map((payment) => (
                    <tr
                      key={`payment-${payment._id}`}
                      className="child payment"
                      data-cy="event_payment_row"
                    >
                      <td data-cy="event_payment_name">{payment.name}</td>
                      <td className="text-right" data-cy="event_payment_amount">
                        {money(payment.amount)}
                      </td>
                      <td className="text-center" data-cy="event_payment_status">
                        {paymentStatusPill(payment.status)}
                      </td>
                      <td data-cy="event_payment_method">{payment.method || "—"}</td>
                      <td>
                        {!payment.deleted && (
                          <div className="dropdown relative group">
                            <button
                              className="btn btn-white btn-sm flex items-center text-gray-600 hover:text-blue-600"
                              onClick={() => toggleDropdown(`payment-${payment._id}`)}
                            >
                              <i className="fas fa-cog mr-1"></i>
                              <i className="caret"></i>
                            </button>
                            <ul
                              className={`dropdown-menu absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg ${
                                openDropdown === `payment-${payment._id}` ? "block" : "hidden"
                              }`}
                            >
                              <li>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => onAddPayment({ ...order, isEdit: true, paymentId: payment._id })}
                                >
                                  <i className="far fa-money-bill-alt mr-2"></i>
                                  Update Payment
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                {!isDepositedOrPaid && deposit > 0 && !hasDepositPayment && ( // Added !hasDepositPayment to prevent duplication
                  <tr
                    key={`deposit-${orderId}`}
                    className="child payment"
                    data-cy="event_payment_row"
                  >
                    <td data-cy="event_payment_name">Deposit</td>
                    <td className="text-right" data-cy="event_payment_amount">
                      {money(deposit)}
                    </td>
                    <td className="text-center" data-cy="event_payment_status">
                      {paymentStatusPill(order.paymentStatus === "deposited" ? "deposited" : "pending")}
                    </td>
                    <td data-cy="event_payment_method">{order.paymentMethod || "—"}</td>
                    <td>
                      <div className="dropdown relative group">
                        <button
                          className="btn btn-white btn-sm flex items-center text-gray-600 hover:text-blue-600"
                          onClick={() => toggleDropdown(`deposit-${orderId}`)}
                        >
                          <span className="text-lg">⋯</span>
                        </button>
                        <ul
                          className={`dropdown-menu absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg ${
                            openDropdown === `deposit-${orderId}` ? "block" : "hidden"
                          }`}
                        >
                          <li>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={handlePay}
                            >
                              <i className="far fa-money-bill-alt mr-2"></i>
                              Pay
                            </button>
                          </li>
                          <li>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                              onClick={handleEdit}
                            >
                              <i className="fas fa-edit mr-2"></i>
                              Edit
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}

                <tr className="total-amount-row font-bold bg-white">
                  <td>
                    <em>Total Outstanding</em>
                  </td>
                  <td className="text-right">{money(totalOutstanding)}</td>
                  <td colSpan="3"></td>
                </tr>
              </tbody>
            </table>

            <div className="m-4">
              <button
                className="btn btn-primary btn-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                data-cy="add_payment"
                onClick={() => onAddPayment(order)}
              >
                Add a Payment
              </button>
            </div>
          </div>
        </div>
      </div>
      {toggleShowDeleted && (
        <div className="text-sm mt-4">
          <button className="text-blue-600 hover:underline" onClick={toggleShowDeleted}>
            {showDeleted ? "Hide deleted payments" : "Show deleted payments"}
          </button>
        </div>
      )}
    </section>
  );
};

export default PaymentPanel;