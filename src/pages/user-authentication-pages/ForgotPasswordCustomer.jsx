import { useState } from "react";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import FormStatus from "../../components/FormStatus";

const ForgotPasswordCustomer = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return "Invalid email format";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      setSuccessMessage("");

      const res = await axios.post("/customers/forgot-password", { email }, { withCredentials: true });
      console.log("Response from server:", res.data); // Debug

      setSuccessMessage(res.data.message || "Email verified. Redirecting...");
      setLoading(false);

      // Chuyển hướng sau 2s
      setTimeout(() => {
        navigate("/customers/reset-password");
      }, 2000);
    } catch (err) {
      setLoading(false);
      const message =
        err.response?.data?.message || "Failed to verify email. Please try again.";
      setErrors({ general: message });
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center mt-8 dark:bg-gray-900">
      <div className="flex items-center dark:bg-gray-800 bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        {/* Left Form Section */}
        <div className="w-1/2 p-10">
          <h2 className="dark:text-white text-primary text-2xl font-semibold mb-4">Forgot Password</h2>
          <FormStatus
            loading={loading}
            errorMessage={errors.general}
          />
          <form onSubmit={handleSubmit} noValidate>
            <label className="block dark:text-gray-400 text-maintext mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@mail.com"
              required
              className={`w-full p-3 rounded-md dark:bg-gray-700 dark:text-white text-subtitle border ${
                errors.general ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1`}
            />
            {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email}</p>}
            
            <button
              type="submit"
              className="w-full mt-4 p-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>
          
        </div>

        {/* Right Section */}
        <div className="w-1/2 flex items-center justify-center dark:bg-gray-800 bg-white my-3">
          <div className="border border-blue-600 py-24 px-10 rounded-lg text-center">
            <h2 className="text-blue-500 text-6xl font-bold">CAR HUNT</h2>
            <p className="dark:text-white text-lg my-4">Welcome to CAR HUNT</p>
            <FormStatus
            successMessage={successMessage}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordCustomer;