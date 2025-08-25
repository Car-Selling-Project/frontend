import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useCarData from "../../../hooks/useCarData.js";
import { StarRating } from "../../car-browsing-pages/Details.jsx";
import axios from "../../../api/axiosInstance.js";
import { Button, Select } from "antd";
import { useAuth } from "../../../hooks/useAuth.js";

const { Option } = Select;

const InfoFilling = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cars } = useCarData();
  const carId = searchParams.get("carId");
  const car = cars.find((c) => c._id === carId);
  const { user } = useAuth();

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [billingInfo, setBillingInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    citizenId: "",
  });
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("");
  const [paymentType, setPaymentType] = useState("full");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [deposit, setDeposit] = useState("");
  const [bankDetails, setBankDetails] = useState({ bankName: "", bankAccountNumber: "" });
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get("/customers/locations", {
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        });
        setLocations(res.data); // expecting [{ _id, name }]
      } catch (err) {
        console.error("Fetch locations error", err);
      }
    };
    fetchLocations();
  }, [user?.accessToken]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get("/customers/admins", {
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        });
        setAdmins(res.data.data); // backend trả về { message, data }
      } catch (err) {
        console.error("Fetch admins error", err);
      }
    };
    fetchAdmins();
  }, [user?.accessToken]);

  const summary = useMemo(() => {
    if (!car) return null;
    const registrationFee = 500;
    const insuranceFee = 300;
    const taxRate = 0.1;
    const subtotal = car.price * quantity;
    const tax = subtotal * taxRate;
    const fullPrice = Math.round(subtotal + tax + registrationFee + insuranceFee);

    let depositAmount = 0;
    if (paymentType === "deposit" && deposit) {
      depositAmount = Number(deposit);
    } else if (paymentType === "full") {
      depositAmount = fullPrice;
    }

    return { subtotal, tax, registrationFee, insuranceFee, fullPrice, depositAmount };
  }, [car, quantity, paymentType, deposit]);

  const handleCreateOrder = async () => {
    if (!car) return setError("Car not found");

    // Validate billing info
    const { fullName, email, phone, address, citizenId } = billingInfo;
    if (!fullName || !email || !phone || !address || !citizenId) {
      setError("Please fill in all billing details");
      return;
    }

    if (!location) {
      setError("Please enter delivery location");
      return;
    }

    if (!selectedAdmin) {
      setError("Please select an admin for this order");
      return;
    }

    // Validate payment
    if (paymentType === "deposit") {
      const minDeposit = Math.round(0.3 * summary.fullPrice);
      if (!deposit || Number(deposit) < minDeposit || Number(deposit) > summary.fullPrice) {
        setError(`Deposit must be between ${minDeposit} and ${summary.fullPrice}`);
        return;
      }
    }

    if (paymentMethod === "bank_transfer") {
      if (!bankDetails.bankName || !bankDetails.bankAccountNumber) {
        setError("Please enter bank details");
        return;
      }
    }

    try {
      const payload = {
        admin: selectedAdmin,
        carInfo: carId,
        quantity,
        paymentMethod,
        paymentType,
        bankDetails: paymentMethod === "bank_transfer" ? bankDetails : {},
        qrCodeUrl: "", // Always empty, QR code handled in Payment page
        deposit: paymentType === "deposit" ? Number(deposit) : summary.fullPrice,
        customerInfo: billingInfo,
        location,
      };

      const res = await axios.post("/customers/orderss/customers-create", payload, {
        headers: { Authorization: `Bearer ${user?.accessToken}` },
      });

      setSuccessMsg("✅ Order created successfully!");
      setError("");
      setTimeout(() => navigate("/customers/orders"), 3000);
    } catch (err) {
      console.error("Create order error", err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <main className="mx-auto p-6 rounded-lg flex flex-row gap-8 items-start">
      <div className="flex-1">
        {/* Quantity */}
        <section className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Quantity</h2>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-24 p-2 border rounded"
          />
        </section>

        {/* Billing Info */}
        <section className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Billing Info</h2>
          <div className="space-y-3">
            <input
              className="w-full p-3 border rounded"
              type="text"
              placeholder="Full Name"
              value={billingInfo.fullName}
              onChange={(e) => setBillingInfo((prev) => ({ ...prev, fullName: e.target.value }))}
            />
            <input
              className="w-full p-3 border rounded"
              type="email"
              placeholder="Email"
              value={billingInfo.email}
              onChange={(e) => setBillingInfo((prev) => ({ ...prev, email: e.target.value }))}
            />
            <input
              className="w-full p-3 border rounded"
              type="text"
              placeholder="Phone number"
              value={billingInfo.phone}
              onChange={(e) => setBillingInfo((prev) => ({ ...prev, phone: e.target.value }))}
            />
            <input
              className="w-full p-3 border rounded"
              type="text"
              placeholder="Delivery address"
              value={billingInfo.address}
              onChange={(e) => setBillingInfo((prev) => ({ ...prev, address: e.target.value }))}
            />
            <input
              className="w-full p-3 border rounded"
              type="text"
              placeholder="Your citizen ID"
              value={billingInfo.citizenId}
              onChange={(e) => setBillingInfo((prev) => ({ ...prev, citizenId: e.target.value }))}
            />
          </div>
        </section>

        {/* Location */}
        <section className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Delivery Location City</h2>
          <Select
            placeholder="Select delivery location"
            className="w-full"
            value={location || undefined}
            onChange={(value) => setLocation(value)}
          >
            {locations.map((loc) => (
              <Option key={loc._id} value={loc._id}>
                {loc.name}
              </Option>
            ))}
          </Select>
        </section>

        {/* Payment Type */}
        <section className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Payment Type</h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentType"
                value="full"
                checked={paymentType === "full"}
                onChange={() => setPaymentType("full")}
              />
              <span>Full Payment</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentType"
                value="deposit"
                checked={paymentType === "deposit"}
                onChange={() => setPaymentType("deposit")}
              />
              <span>Deposit</span>
            </label>
            {paymentType === "deposit" && (
              <input
                className="w-full p-2 border rounded"
                type="number"
                placeholder={`Enter deposit amount (min ${summary ? Math.round(0.3 * summary.fullPrice) : 0})`}
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
              />
            )}
          </div>
        </section>

        {/* Payment Method */}
        <section className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Payment Method</h2>
          <div className="space-y-3">
            {["cash", "bank_transfer", "qr"].map((method) => (
              <label key={method} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="method"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                />
                <span>{method.replace("_", " ").toUpperCase()}</span>
              </label>
            ))}
          </div>
          {paymentMethod === "bank_transfer" && (
            <div className="mt-4 space-y-3">
              <input
                className="w-full p-3 border rounded"
                type="text"
                placeholder="Bank Name"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
              />
              <input
                className="w-full p-3 border rounded"
                type="text"
                placeholder="Bank Account Number"
                value={bankDetails.bankAccountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, bankAccountNumber: e.target.value })}
              />
            </div>
          )}
          {paymentMethod === "qr" && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                QR code payment will be processed in the next step.
              </p>
            </div>
          )}
        </section>

        {/* Seller Selection */}
        <section className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Assign Seller</h2>
          <Select
            placeholder="Select seller"
            className="w-full"
            value={selectedAdmin || undefined}
            onChange={(value) => setSelectedAdmin(value)}
          >
            {admins.map((admin) => (
              <Option key={admin._id} value={admin._id}>
                {admin.name} – {admin.email}
              </Option>
            ))}
          </Select>
        </section>

        {/* Confirmation */}
        <section className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Confirmation</h2>
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
            />
            <span>I agree with the terms and conditions and privacy policy.</span>
          </label>
          <Button
            className={`w-full py-2 rounded mt-4 ${
              agreeTerms ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            disabled={!agreeTerms}
            onClick={handleCreateOrder}
          >
            Confirm Order
          </Button>
          {error && <p className="text-red-500 font-medium text-sm my-4">! {error}</p>}
          {successMsg && <p className="text-green-600 font-medium text-sm my-4">{successMsg}</p>}
        </section>
      </div>

      {/* Order Summary */}
      <div className="w-1/3">
        <section className="mb-6 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Order Summary</h2>
          {car ? (
            <div className="p-4 border rounded-lg bg-gray-100">
              <div className="flex flex-col items-center mb-4">
                <img
                  className="w-full h-20 object-contain rounded mb-2"
                  src={car.images[0]}
                  alt={car.title}
                />
                <h3 className="text-lg font-medium">{car.title}</h3>
                <StarRating rating={car.rating} />
              </div>
              <p className="text-lg">Car price × {quantity}: ${summary.subtotal.toLocaleString()}</p>
              <p className="text-lg">Tax (10%): ${summary.tax.toLocaleString()}</p>
              <p className="text-lg">Registration fee: ${summary.registrationFee}</p>
              <p className="text-lg">Insurance fee: ${summary.insuranceFee}</p>
              <h3 className="text-xl font-semibold mt-4">
                Total Price: ${summary.fullPrice.toLocaleString()}
              </h3>
              {paymentType === "deposit" && (
                <p className="text-md mt-2">Deposit: ${summary.depositAmount.toLocaleString()}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No car selected. Please go back to select a car.</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default InfoFilling;