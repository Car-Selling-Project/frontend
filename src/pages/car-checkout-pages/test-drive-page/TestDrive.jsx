import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";
import FormStatus from "../../../components/FormStatus";

const TestDrive = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    citizenId: "",
    address: "",
    carInfo: "",
    location: "",
    requestDay: "",
    note: "",
    terms: false,
    promotions: false,
    driverLicense: false,
  });

  const [cars, setCars] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    api
      .get("/customers/cars")
      .then((res) => {
        const carList = Array.isArray(res.data) ? res.data : res.data.cars || [];
        setCars(carList);
      })
      .catch(() => setCars([]));

    api
      .get("/customers/locations")
      .then((res) => {
        const locationList = Array.isArray(res.data) ? res.data : res.data.locations || [];
        setLocations(locationList);
      })
      .catch(() => setLocations([]));
  }, []);

  useEffect(() => {
    const car = cars.find((c) => c._id === formData.carInfo);
    setSelectedCar(car || null);
  }, [cars, formData.carInfo]);

  const validateField = (field) => {
    switch (field) {
      case "fullName":
        if (!formData.fullName.trim()) return "Full name is required";
        if (!/^\p{Lu}\p{Ll}*(\s\p{Lu}\p{Ll}*)*$/u.test(formData.fullName))
          return "Full name must capitalize each word (e.g., Nguyễn Văn A)";
        break;
      case "phone":
        if (!formData.phone.trim()) return "Phone number is required";
        if (!/^(086|096|097|098|032|033|034|035|036|037|038|039|088|091|094|083|084|085|081|082|089|090|093|070|079|077|076|078|092|056|058|099|059)\d{7}$/.test(formData.phone))
          return "Phone number must be a valid Vietnamese format";
        break;
      case "email":
        if (!formData.email.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
          return "Invalid email format";
        break;
      case "citizenId":
        if (!formData.citizenId.trim()) return "Citizen ID is required";
        if (!/^0\d{11}$/.test(formData.citizenId))
          return "Citizen ID must start with 0 and contain exactly 12 digits";
        break;
      case "address":
        if (!formData.address.trim()) return "Address is required";
        break;
      case "carInfo":
        if (!formData.carInfo) return "Please select a car";
        break;
      case "location":
        if (!formData.location) return "Please select a location";
        break;
      case "requestDay":
        if (!formData.requestDay) return "Request day is required";
        const date = new Date(formData.requestDay);
        const now = new Date();
        if (date < now) return "Request day cannot be in the past";
        const hour = date.getHours();
        if (hour < 12) return "Request time must be from 12:00 noon or later";
        if (hour >= 22) return "Request time must be before 22:00 (10 PM)";
        break;
      case "terms":
        if (!formData.terms) return "You must agree to terms & conditions";
        break;
      case "driverLicense":
        if (!formData.driverLicense) return "Driver license confirmation required";
        break;
      default:
        return null;
    }
    return null;
  };

  const handleBlurField = (field) => {
    const msg = validateField(field);
    setErrors((prev) => ({ ...prev, [field]: msg }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const fields = [
      "fullName",
      "phone",
      "email",
      "citizenId",
      "address",
      "carInfo",
      "location",
      "requestDay",
      "terms",
      "driverLicense",
    ];
    fields.forEach((f) => {
      const msg = validateField(f);
      if (msg) newErrors[f] = msg;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      carInfo: formData.carInfo,
      location: formData.location,
      requestDay: formData.requestDay,
      note: formData.note,
      customerInfo: {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        citizenId: formData.citizenId,
        address: formData.address,
      },
    };

    try {
      setLoading(true);
      setSuccessMessage("");
      setErrors({});
      console.log("Sending payload:", payload); // Debug payload
      await api.post("/customers/testdrives", payload);
      setSuccessMessage("Registration successful! Redirecting...");
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        citizenId: "",
        address: "",
        carInfo: "",
        location: "",
        requestDay: "",
        note: "",
        terms: false,
        promotions: false,
        driverLicense: false,
      });
    } catch (err) {
      console.log("Backend error response:", err.response?.data); // Debug response
      const backendErrors = err.response?.data?.errors || [];
      const mappedErrors = {};
      backendErrors.forEach((e) => {
        const key = e.key.startsWith("customerInfo.") ? e.key.replace("customerInfo.", "") : e.key;
        mappedErrors[key] = e.message;
      });
      // Handle non-validation errors (e.g., from createTestDrive)
      if (Object.keys(mappedErrors).length === 0) {
        mappedErrors.general = err.response?.data?.message || err.response?.data?.error || "Failed to submit test drive request";
      }
      setErrors(mappedErrors);
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center mt-8 dark:bg-gray-900">
      <div className="flex dark:bg-gray-800 bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl w-full">
        {/* Left Form */}
        <div className="w-1/2 p-10">
          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <label className="block dark:text-gray-400 text-maintext mb-2">
              Full Name*
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onBlur={() => handleBlurField("fullName")}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className={`w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white border ${
                errors.fullName ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mb-2">{errors.fullName}</p>
            )}

            {/* Phone */}
            <label className="block dark:text-gray-400 text-maintext mb-2">
              Phone Number*
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onBlur={() => handleBlurField("phone")}
              onChange={handleChange}
              placeholder="0934997481"
              className={`w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white border ${
                errors.phone ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mb-2">{errors.phone}</p>
            )}

            {/* Email */}
            <label className="block dark:text-gray-400 text-maintext mb-2">
              Email*
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onBlur={() => handleBlurField("email")}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className={`w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white border ${
                errors.email ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-2">{errors.email}</p>
            )}

            {/* Citizen ID */}
            <label className="block dark:text-gray-400 text-maintext mb-2">
              Citizen ID*
            </label>
            <input
              type="text"
              name="citizenId"
              value={formData.citizenId}
              onBlur={() => handleBlurField("citizenId")}
              onChange={handleChange}
              placeholder="012345678901"
              className={`w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white border ${
                errors.citizenId ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.citizenId && (
              <p className="text-red-500 text-sm mb-2">{errors.citizenId}</p>
            )}

            {/* Address */}
            <label className="block dark:text-gray-400 text-maintext mb-2">
              Address*
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onBlur={() => handleBlurField("address")}
              onChange={handleChange}
              placeholder="123 Main St, City"
              className={`w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white border ${
                errors.address ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mb-2">{errors.address}</p>
            )}

            {/* Car */}
            <label className="block dark:text-gray-400 text-maintext mb-2">
              Car*
            </label>
            <select
              name="carInfo"
              value={formData.carInfo}
              onBlur={() => handleBlurField("carInfo")}
              onChange={handleChange}
              className={`w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white border ${
                errors.carInfo ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select a car</option>
              {cars.map((car) => (
                <option key={car._id} value={car._id}>
                  {car.title}
                </option>
              ))}
            </select>
            {errors.carInfo && (
              <p className="text-red-500 text-sm mb-2">{errors.carInfo}</p>
            )}

            {/* Preview car */}
            {selectedCar && selectedCar.images?.length > 0 && (
              <div className="my-5">
                <h3 className="dark:text-white">{selectedCar.title}</h3>
                <img
                  src={selectedCar.images[0]}
                  alt={selectedCar.title}
                  className="max-w-full rounded-md"
                />
              </div>
            )}

            {/* Location */}
            <label className="block dark:text-gray-400 text-maintext mb-2">
              Location*
            </label>
            <select
              name="location"
              value={formData.location}
              onBlur={() => handleBlurField("location")}
              onChange={handleChange}
              className={`w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white border ${
                errors.location ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select a location</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="text-red-500 text-sm mb-2">{errors.location}</p>
            )}

            {/* Request Day */}
            <label className="block dark:text-gray-400 text-maintext mb-2">
              Request Day*
            </label>
            <input
              type="datetime-local"
              name="requestDay"
              value={formData.requestDay}
              onBlur={() => handleBlurField("requestDay")}
              onChange={handleChange}
              className={`w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white border ${
                errors.requestDay ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.requestDay && (
              <p className="text-red-500 text-sm mb-2">{errors.requestDay}</p>
            )}

            {/* Note */}
            <label className="block dark:text-gray-400 text-maintext mb-2">
              Note
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Enter your note here"
              className="w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.note && (
              <p className="text-red-500 text-sm mb-2">{errors.note}</p>
            )}

            {/* Terms */}
            <div className="my-3 flex items-center">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onBlur={() => handleBlurField("terms")}
                onChange={handleChange}
                className="w-5 h-5 mr-2"
              />
              <label className="dark:text-white">
                I agree to the terms and conditions
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-sm mb-2">{errors.terms}</p>
            )}

            {/* Promotions */}
            <div className="my-3 flex items-center">
              <input
                type="checkbox"
                name="promotions"
                checked={formData.promotions}
                onChange={handleChange}
                className="w-5 h-5 mr-2"
              />
              <label className="dark:text-white">
                I want to receive promotions and updates
              </label>
            </div>

            {/* Driver License */}
            <div className="my-3 flex items-center">
              <input
                type="checkbox"
                name="driverLicense"
                checked={formData.driverLicense}
                onBlur={() => handleBlurField("driverLicense")}
                onChange={handleChange}
                className="w-5 h-5 mr-2"
              />
              <label className="dark:text-white">I have a driver license</label>
            </div>
            {errors.driverLicense && (
              <p className="text-red-500 text-sm mb-2">{errors.driverLicense}</p>
            )}

            <button
              type="submit"
              className="w-full mt-6 p-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>

        {/* Right Info Section */}
        <div className="w-1/2 flex items-center justify-center dark:bg-gray-800 bg-white">
          <div className="border border-blue-600 py-24 px-20 rounded-lg text-center">
            <h2 className="text-blue-500 text-6xl font-bold">CAR HUNT</h2>
            <p className="dark:text-white text-lg mt-4">Welcome to CAR HUNT</p>
            <h2 className="dark:text-white text-primary text-4xl font-semibold my-6">
              Test Drive Registration
            </h2>
            <FormStatus
              loading={loading}
              successMessage={successMessage}
              errorMessage={errors.general}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDrive;