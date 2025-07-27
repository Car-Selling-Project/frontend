import { useState } from "react";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";
import FormStatus from "../../components/FormStatus";

const ResetPWAdmin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      setSuccessMessage("");

      await axios.patch("/admins/reset-password", {
        password,
        confirmPassword,
      });

      setSuccessMessage("Password reset successfully! Redirecting to login...");
      setLoading(false);

      setTimeout(() => navigate("/customers/login"), 2000);
    } catch (err) {
      setLoading(false);
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setErrors({ general: message });
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center mt-8 dark:bg-gray-900">
      <div className="flex dark:bg-gray-800 bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        {/* Left Form Section */}
        <div className="w-1/2 p-10">
          <h2 className="dark:text-white text-primary text-2xl font-semibold mb-4">
            Reset Password
          </h2>

          <FormStatus
            loading={loading}
            errorMessage={errors.general}
          />

          <form onSubmit={handleResetPassword} noValidate>
            {/* Password */}
            <label className="block dark:text-gray-400 text-maintext mb-2">
              Password
            </label>
            <div className="relative my-3">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className={`w-full p-3 rounded-md dark:bg-gray-700 dark:text-white text-subtitle border ${
                  errors.password ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <span
                className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeFilled className="text-lg" />
                ) : (
                  <EyeInvisibleFilled className="text-lg" />
                )}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}

            {/* Confirm Password */}
            <label className="block dark:text-gray-400 text-maintext mb-2">
              Confirm Password
            </label>
            <div className="relative my-3">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                className={`w-full p-3 rounded-md dark:bg-gray-700 dark:text-white text-subtitle border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <span
                className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <EyeFilled className="text-lg" />
                ) : (
                  <EyeInvisibleFilled className="text-lg" />
                )}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}

            <button
              type="submit"
              className="w-full mt-6 p-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
            >
              Reset Password
            </button>
          </form>
        </div>

        {/* Right Section */}
        <div className="w-1/2 flex items-center justify-center dark:bg-gray-800 bg-white">
          <div className="border border-blue-600 py-24 px-10 rounded-lg text-center">
            <h2 className="text-blue-500 text-6xl font-bold">CAR HUNT</h2>
            <p className="dark:text-white text-lg my-4">Welcome back!</p>
            <FormStatus
            successMessage={successMessage}
            />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPWAdmin;