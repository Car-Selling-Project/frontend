import React, { useState } from "react";
import useCarData from "../../../hooks/useCarData.js";
import { useSearchParams } from "react-router-dom";
import { StarRating } from "../../car-browsing-pages/Details.jsx";
import axios from "../../../api/axiosInstance.js";
import { DatePicker, Select, Button } from "antd";
import dayjs from "dayjs";
import { useAuth } from "../../../hooks/useAuth.js";

const Payment = () => {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [searchParams] = useSearchParams();
  const { cars } = useCarData();
  const carId = searchParams.get("carId");
  const car = cars.find((c) => c._id === carId);
  const [error, setError] = useState("");
  const { user } = useAuth();

  //State for Billing Info
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  //State for Rental Info
  const [pickUp, setPickUp] = useState({location: null, date: null});
  const [dropOff, setDropOff] = useState({ location: null, date: null });

  //Handle Payment
  const handleStripeCheckout = async () => {
    // Handle Billing Info
    if (!billingInfo.name || !billingInfo.phone || !billingInfo.address || !billingInfo.city) {
      setError("Please fill in all billing details");
      return;
    }
    //Handle Rental Info
    if (!pickUp || !dropOff) {
      setError("Please fill in all rental details");
      return;
    }
    //Handle Availabily
    const isAvailable = checkAvailability (car, pickUp.date, dropOff.date);
    if (!isAvailable) {
      setError("Car is not available for the selected dates");
    return;
    }
    try {
      const res = await axios.post("/payment/create-session", {
          car,
          billingInfo,
          pickUp: {
            location: pickUp.location,
            date: pickUp.date.format("YYYY-MM-DD"),
          },
          dropOff: {
            location: dropOff.location,
            date: dropOff.date.format("YYYY-MM-DD"),
          },
          paymentMethod: "Credit Card (via Stripe)", 
          status: "On delivery", 
        },
        {
          headers: { Authorization: `Bearer ${user?.token}` }, 
        }
      );
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Stripe session error", err);
      setError("Something went wrong with payment setup. Please try again.");
    }
  };

  //Check Availability
  const checkAvailability = (car, pickUpDate, dropOffDate) => {
    if (!car.date_available || !pickUpDate || !dropOffDate) return false;
    const [startDateStr, endDateStr] = car.date_available;
    const startDate = dayjs(startDateStr);
    const endDate = dayjs(endDateStr);
      return (
      (pickUpDate.isSame(startDate, "day") || pickUpDate.isAfter(startDate, "day")) &&
      (dropOffDate.isSame(endDate, "day") || dropOffDate.isBefore(endDate, "day")) &&
      pickUpDate.isBefore(dropOffDate, "day")
    );
  };


  return (
    <main className="mx-auto p-6 rounded-lg flex flex-row gap-8 items-start">
      <div>
        {/* Billing Info */}
        <section className="mb-6 p-6 bg-white dark:bg-gray-700 dark:text-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Billing Info</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">Please enter your billing info</p>
          <div className="space-y-3">
          <input
              className="w-full p-3 border rounded"
              type="text"
              placeholder="Your name"
              value={billingInfo.name}
              onChange={(e) => setBillingInfo((prev) => ({ ...prev, name: e.target.value }))}
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
              placeholder="Address"
              value={billingInfo.address}
              onChange={(e) => setBillingInfo((prev) => ({ ...prev, address: e.target.value }))}
            />
            <input
              className="w-full p-3 border rounded"
              type="text"
              placeholder="Town or city"
              value={billingInfo.city}
              onChange={(e) => setBillingInfo((prev) => ({ ...prev, city: e.target.value }))}
            />
           </div>
        </section>

        {/* Rental Info */}
        <section className="mb-6 p-6 bg-white dark:bg-gray-700 dark:text-white shadow-md rounded-lg">
              <h2 className="text-2xl font-semibold mb-2">Rental Info</h2>
              <p className="text-gray-500 dark:text-gray-300 mb-4">Please select your rental date</p>
              <div className="grid grid-cols-2 gap-4 gap-y-4">
                <div>
                  <h3 className="font-medium mb-1">Pick-Up</h3>
                  <Select
                    value={pickUp.location}
                    onChange={(value) => setPickUp((prev) => ({ ...prev, location: value }))}
                    placeholder="Select location"
                    className="w-full mt-2"
                    allowClear
                  >
                    <Select.Option value="Ho Chi Minh">Ho Chi Minh</Select.Option>
                    <Select.Option value="Ha Noi">Ha Noi</Select.Option>
                    <Select.Option value="Da Nang">Da Nang</Select.Option>
                    <Select.Option value="Hue">Hue</Select.Option>
                  </Select>
                  <DatePicker
                    value={pickUp.date}
                    onChange={(date) => setPickUp((prev) => ({ ...prev, date }))}
                    format="YYYY-MM-DD"
                    className="w-full mt-2"
                    disabledDate={(current) => current && current < dayjs().startOf("day")}
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Drop-Off</h3>
                  <Select
                    value={dropOff.location}
                    onChange={(value) => setDropOff((prev) => ({ ...prev, location: value }))}
                    placeholder="Select location"
                    className="w-full mt-2"
                    allowClear
                  >
                    <Select.Option value="Ho Chi Minh">Ho Chi Minh</Select.Option>
                    <Select.Option value="Ha Noi">Ha Noi</Select.Option>
                    <Select.Option value="Da Nang">Da Nang</Select.Option>
                    <Select.Option value="Hue">Hue</Select.Option>
                  </Select>
                  <DatePicker
                    value={dropOff.date}
                    onChange={(date) => setDropOff((prev) => ({ ...prev, date }))}
                    format="YYYY-MM-DD"
                    className="w-full mt-2"
                    disabledDate={(current) =>
                      current &&
                      (current < dayjs().startOf("day") || (pickUp.date && current < pickUp.date))
                    }
                  />
                </div>
              </div>
            </section>

        {/* Payment Method - only Stripe */}
        <section className="mb-6 p-6 bg-white dark:bg-gray-700 dark:text-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Payment Method</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">
            Only <strong>Credit Card (via Stripe)</strong> is available at the moment.
          </p>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input type="radio" name="payment" checked readOnly />
              <span>Credit Card (via Stripe)</span>
            </label>

            {/* Disabled options */}
            <label className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
              <input type="radio" name="payment" disabled />
              <span>PayPal (coming soon)</span>
            </label>
            <label className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
              <input type="radio" name="payment" disabled />
              <span>Bitcoin (coming soon)</span>
            </label>
          </div>
        </section>

        {/* Confirmation */}
        <section className="mb-6 p-6 bg-white dark:bg-gray-700 dark:text-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Confirmation</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">
            We are getting to the end. Just a few clicks and your rental is ready!
          </p>
          <label className="flex items-center space-x-2">
            <input type="checkbox" />
            <span>I agree with receiving marketing emails. No spam, promised!</span>
          </label>
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
            />
            <span>I agree with the terms and conditions and privacy policy.</span>
          </label>
          <Button
            className={`w-full py-2 rounded mt-4 ${agreeTerms ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
            disabled={!agreeTerms}
            onClick={handleStripeCheckout}
          >
            Rent Now
          </Button>
          {error && <p className="text-red-500 font-medium text-sm my-4">! {error}</p>}
        </section>
      </div>

      {/* Rental Summary */}
      <div>
        <section className="mb-6 p-6 bg-white dark:bg-gray-700 dark:text-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Rental Summary</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-4">
            Prices may change depending on rental length and car type.
          </p>
          {car ? (
            <div className="p-4 border dark:border-gray-500 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white">
              <div className="flex flex-col items-center mb-4">
                <img className="w-full h-16 object-contain rounded mb-2" src={car.image} alt={car.name} />
                <h3 className="text-lg font-medium">{car.name}</h3>
                <StarRating rating={car.rating} />
              </div>
              <p className="text-lg font-semibold mt-2 text-right">Subtotal: ${car.price.discounted}</p>
              <p className="text-lg text-right">Tax: $0</p>
              <div className="flex flex-row gap-2">
                <input className="w-2/3 p-2 border rounded mt-2" type="text" placeholder="Apply promo code" />
                <button className="w-1/3 bg-blue-600 text-white py-2 rounded mt-2">Apply</button>
              </div>
              <h3 className="text-2xl font-semibold mt-4 text-right">Total Rental Price: ${car.price.discounted}</h3>
            </div>
          ) : (
            <p className="text-gray-500">No car selected.</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default Payment;