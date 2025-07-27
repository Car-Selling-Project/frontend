import { useState } from "react";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import FormStatus from "../../components/FormStatus";

const ForgotPasswordAdmin = () => {
  const navigate = useNavigate();

  const [employeeCode, setEmployeeCode] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmployeeCode = (value) => {
    if (!value.trim()) return "Employee Code is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const employeeCodeError = validateEmployeeCode(employeeCode);
    if (employeeCodeError) {
      setErrors({ employeeCode: employeeCodeError });
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      setSuccessMessage("");

      const res = await axios.post("/admins/forgot-password", { employeeCode });

      setSuccessMessage(res.data.message || "Employee Code is verified. Redirecting...");
      setLoading(false);

      // Chuyển hướng sau 2s
      setTimeout(() => {
        navigate("/admins/reset-password");
      }, 2000);
    } catch (err) {
      setLoading(false);
      const message =
        err.response?.data?.message || "Failed to verify employee code. Please try again.";
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
            <label className="block dark:text-gray-400 text-maintext mb-2">Employee Code</label>
            <input
              type="text"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              placeholder="Input your employee code"
              required
              className={`w-full p-3 rounded-md dark:bg-gray-700 dark:text-white text-subtitle border ${
                errors.general ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1`}
            />
            {errors.employeeCode && <p className="text-red-500 text-sm mb-3">{errors.employeeCode}</p>}
            
            <button
              type="submit"
              className="w-full mt-4 p-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Employee Code"}
            </button>
          </form>
          
        </div>

        {/* Right Section */}
        <div className="w-1/2 flex items-center justify-center dark:bg-gray-800 bg-white my-3">
          <div className="border border-blue-600 py-24 px-10 rounded-lg text-center">
            <h2 className="text-blue-500 text-6xl font-bold">CAR HUNT</h2>
            <p className="dark:text-white text-lg my-4">Welcome to CAR HUNT</p>
            <h2 className="dark:text-white text-primary text-2xl font-semibold mt-4">Admin Portal Sign Up</h2>
            <FormStatus
            successMessage={successMessage}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordAdmin;