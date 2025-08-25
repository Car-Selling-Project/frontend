
import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  CarOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  BankOutlined,
  QrcodeOutlined,
  FileDoneOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import PaymentPanel from "../../components/PaymentPanel";
import PayModal from "../../components/PayModal";
import { useAuth } from "../../hooks/useAuth";
import axios from "../../api/axiosInstance";

const OrderDetail = ({ open, order, onClose }) => {
  const { user } = useAuth();
  const [currentOrder, setCurrentOrder] = useState(order);
  const [modalOpen, setModalOpen] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [error, setError] = useState(null);

  // Fetch contract data
  const fetchContract = async () => {
    if (!user || !order?._id) return;
    try {
      setError(null);
      const response = await axios.get(`/customers/orders/${order._id}/contract`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setCurrentOrder((prev) => ({
        ...prev,
        contract: response.data.contract || {},
      }));
    } catch (err) {
      console.error("Fetch contract error:", err);
      setError(err.response?.status === 404 ? "Contract not found" : err.response?.data?.message || "Failed to fetch contract");
      setCurrentOrder((prev) => ({
        ...prev,
        contract: {},
      }));
    }
  };

  // Fetch order data after payment actions
  const fetchOrder = async () => {
    if (!user || !order?._id) return;
    try {
      setError(null);
      const response = await axios.get(`/customers/orderss/${order._id}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setCurrentOrder(response.data.data || order);
    } catch (err) {
      console.error("Fetch order error:", err);
      setError(err.response?.data?.message || "Failed to fetch order");
    }
  };

  // Update currentOrder and fetch contract when order prop changes
  useEffect(() => {
    setCurrentOrder(order);
    if (open && order?._id) {
      fetchContract();
    }
  }, [order, open]);

  const handleAddPayment = async () => {
    setModalOpen(true);
  };

  const handleAddPaymentSubmit = async (orderId, paymentMethod, paymentType, amount) => {
    try {
      const totalPrice = Number(currentOrder.totalPrice || 0);
      const finalAmount = paymentType.toLowerCase() === "full" ? totalPrice : Number(amount || 0);

      // Validate deposit amount
      if (paymentType === "deposit" && (finalAmount < 0.3 * totalPrice || finalAmount >= totalPrice)) {
        throw new Error("Deposit must be at least 30% of totalPrice and less than totalPrice");
      }

      // Call backend to create payment
      await axios.post(
        "/customers/payment",
        {
          orderId,
          paymentType,
          paymentMethod,
          amount: Math.round(finalAmount * 100),
        },
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );

      // Refetch order to sync with backend
      await fetchOrder();

      setModalOpen(false);
    } catch (err) {
      console.error("Error adding payment:", err);
      setError(err.response?.data?.message || "Failed to add payment");
    }
  };

  const handleFail = async (orderId, paymentId) => {
    try {
      // Call backend to cancel payment
      await axios.post(
        "/customers/payments/cancel",
        { orderId, paymentId },
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );

      // Refetch order to sync with backend
      await fetchOrder();
    } catch (err) {
      console.error("Error cancelling payment:", err);
      setError(err.response?.data?.message || "Failed to cancel payment");
    }
  };

  if (!currentOrder) return null;

  const money = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(n || 0));

  const qty = Number(currentOrder.quantity || 1);
  const unitPrice = Number(currentOrder.carInfo?.price || 0);
  const subtotal = unitPrice * qty;
  const tax = subtotal * 0.1; // 10% tax as per InfoFilling
  const registrationFee = 500; // Fixed as per InfoFilling
  const insuranceFee = 300; // Fixed as per InfoFilling
  const fullPrice = Number(currentOrder.totalPrice || subtotal + tax + registrationFee + insuranceFee);
  const depositAmount = Number(currentOrder.deposit || 0);
  const paymentType = currentOrder.paymentType || (depositAmount > 0 && depositAmount < fullPrice ? "deposit" : "full");

  const renderStatusBadge = (status, label) => {
    let color = "text-yellow-700 bg-yellow-100";
    let icon = <LoadingOutlined />;
    if (status === "paid" || status === true || status === "deposited" || status === "signed") {
      color = "text-green-700 bg-green-100";
      icon = <CheckCircleOutlined />;
    } else if (status === "failed" || status === false || status === "canceled" || status === "not_signed") {
      color = "text-red-700 bg-red-100";
      icon = <CloseCircleOutlined />;
    }
    return (
      <span
        className={`w-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${color}`}
      >
        {icon}
        {label}
      </span>
    );
  };

  return (
    <Modal
      open={open}
      width={1200}
      title={
        <div className="flex items-center gap-2 text-xl font-bold">
          <FileTextOutlined /> Order Details #{currentOrder._id?.slice(-8)}
        </div>
      }
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose} size="middle">
          Close
        </Button>,
      ]}
      styles={{ body: { padding: "24px 32px" } }}
    >
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base">
        {/* CỘT TRÁI */}
        <div className="space-y-6">
          {/* Order Info */}
          <section>
            <h3 className="font-semibold flex items-center gap-2 text-lg mb-2">
              <FileTextOutlined /> Order Info
            </h3>
            <div className="flex flex-col gap-2 text-xs">
              {renderStatusBadge(currentOrder.status, `Order: ${currentOrder.status || "N/A"}`)}
            </div>
          </section>

          {/* Customer Detail */}
          <section>
            <h3 className="font-semibold flex items-center gap-2 text-lg mb-2">
              <UserOutlined /> Customer Detail
            </h3>
            <p className="font-medium">
              {currentOrder.customerInfo?.fullName || "N/A"} — {currentOrder.customerInfo?.phone || "N/A"}
            </p>
            <p>{currentOrder.customerInfo?.email || "N/A"}</p>
            <p>Citizen ID: {currentOrder.customerInfo?.citizenId || "N/A"}</p>
            <p>{currentOrder.customerInfo?.address || "N/A"}</p>
          </section>

          {/* Delivery Info */}
          <section>
            <h3 className="font-semibold flex items-center gap-2 text-lg mb-2">
              <EnvironmentOutlined /> Delivery Info
            </h3>
            <p>{currentOrder.location?.name || "N/A"}</p>
            <p className="flex items-center gap-1 text-sm text-gray-600">
              <ClockCircleOutlined /> {currentOrder.createdAt ? new Date(currentOrder.createdAt).toLocaleString() : "N/A"}
            </p>
          </section>

          {/* Car Info */}
          <section>
            <h3 className="font-semibold flex items-center gap-2 text-lg mb-2">
              <CarOutlined /> Car Information
            </h3>
            <p className="font-medium">{currentOrder.carInfo?.title || "N/A"}</p>
            <p>Unit Price: {money(currentOrder.carInfo?.price || 0)}</p>
            <p>Quantity: {qty}</p>
          </section>

          {/* Payment Summary */}
          <section>
            <h3 className="font-semibold flex items-center gap-2 text-lg mb-2">
              <DollarOutlined /> Payment Summary
            </h3>
            <h3 className="flex justify-between mb-3">
              <span>Payment Method:</span>
              <span>{currentOrder.paymentMethod || "N/A"}</span>
            </h3>

            {currentOrder.paymentMethod === "bank_transfer" && (
              <div className="mb-3">
                <h4 className="font-medium flex items-center gap-1">
                  <BankOutlined /> Bank Details
                </h4>
                <p>Bank Name: {currentOrder.bankDetails?.bankName || "N/A"}</p>
                <p>Account Number: {currentOrder.bankDetails?.bankAccountNumber || "N/A"}</p>
              </div>
            )}

            {currentOrder.paymentMethod === "qr" && (
              <div className="mb-3">
                <h4 className="font-medium flex items-center gap-1">
                  <QrcodeOutlined /> QR Code
                </h4>
                {currentOrder.qrCodeUrl ? (
                  <>
                    <img
                      src={currentOrder.qrCodeUrl}
                      alt="QR Code"
                      className="w-32 h-32 object-contain"
                    />
                    <p>
                      QR Code URL: <a href={currentOrder.qrCodeUrl} target="_blank" rel="noopener noreferrer">{currentOrder.qrCodeUrl}</a>
                    </p>
                  </>
                ) : (
                  <p>QR Code: Not yet provided</p>
                )}
              </div>
            )}

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
          </section>
        </div>

        {/* CỘT PHẢI */}
        <div className="space-y-6">
          {/* Contract Section */}
          <section>
            <h3 className="font-semibold flex items-center gap-2 text-lg mb-2">
              <FileDoneOutlined /> Contract Information
            </h3>
            {currentOrder.contract && Object.keys(currentOrder.contract).length > 0 ? (
              <div className="space-y-2 text-base">
                <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                  <span>Status:</span>
                  <span>{renderStatusBadge(currentOrder.contract.status, currentOrder.contract.status || "N/A")}</span>
                </div>
                <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                  <span>Signed:</span>
                  <span>{currentOrder.contract.signed ? "Yes" : "No"}</span>
                </div>
                <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                  <span>Signed by Seller:</span>
                  <span>{currentOrder.contract.signedBySeller ? "Yes" : "No"}</span>
                </div>
                {currentOrder.contract.signedBySeller && (
                  <>
                    <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                      <span>Seller Name:</span>
                      <span>{currentOrder.contract.signedBySellerName || "N/A"}</span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                      <span>Signed At:</span>
                      <span>{currentOrder.contract.signedBySellerAt ? new Date(currentOrder.contract.signedBySellerAt).toLocaleString() : "N/A"}</span>
                    </div>
                    {currentOrder.contract.signatureImageBySeller && (
                      <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                        <span>Seller Signature:</span>
                        <span>
                          <img src={currentOrder.contract.signatureImageBySeller} alt="Seller Signature" className="w-24 h-12 object-contain" />
                        </span>
                      </div>
                    )}
                  </>
                )}
                <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                  <span>Signed by Buyer:</span>
                  <span>{currentOrder.contract.signedByBuyer ? "Yes" : "No"}</span>
                </div>
                {currentOrder.contract.signedByBuyer && (
                  <>
                    <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                      <span>Buyer Name:</span>
                      <span>{currentOrder.contract.signedByBuyerName || "N/A"}</span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                      <span>Signed At:</span>
                      <span>{currentOrder.contract.signedByBuyerAt ? new Date(currentOrder.contract.signedByBuyerAt).toLocaleString() : "N/A"}</span>
                    </div>
                    {currentOrder.contract.signatureImageByBuyer && (
                      <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                        <span>Buyer Signature:</span>
                        <span>
                          <img src={currentOrder.contract.signatureImageByBuyer} alt="Buyer Signature" className="w-24 h-12 object-contain" />
                        </span>
                      </div>
                    )}
                  </>
                )}
                <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                  <span>Contract Link:</span>
                  {currentOrder.contract.url ? (
                    <Button
                      type="primary"
                      icon={<LinkOutlined />}
                      onClick={() => window.open(currentOrder.contract.url, "_blank", "noopener,noreferrer")}
                    >
                      View Contract
                    </Button>
                  ) : (
                    <span>Contract link not yet generated</span>
                  )}
                </div>
              </div>
            ) : (
              <p>No contract information available</p>
            )}
          </section>

          {/* Payment History Section */}
          <PaymentPanel
            order={{ id: currentOrder._id, data: currentOrder }}
            onAddPayment={handleAddPayment}
            onFail={handleFail}
            showDeleted={showDeleted}
            toggleShowDeleted={() => setShowDeleted(!showDeleted)}
          />
        </div>
      </div>

      <PayModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        order={{ id: currentOrder._id, data: currentOrder }}
        onAddPayment={(paymentMethod, paymentType, amount) =>
          handleAddPaymentSubmit(currentOrder._id, paymentMethod, paymentType, amount)
        }
        onFail={(orderId, paymentId) => handleFail(orderId, paymentId)}
      />
    </Modal>
  );
};

export default OrderDetail;