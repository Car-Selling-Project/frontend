import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import FormStatus from "../../components/FormStatus";

const Login = () => {
  const { loginCustomer } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return "Invalid email format";
    return "";
  };

  const validatePassword = (value) => {
    if (!value.trim()) return "Password is required";
    return "";
  };

  const handleBlur = (field) => {
    const newErrors = { ...errors };

    if (field === "email") {
      newErrors.email = validateEmail(email);
    }
    if (field === "password") {
      newErrors.password = validatePassword(password);
    }

    setErrors(newErrors);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
  
    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }
  
    try {
      setErrors({});
      setLoading(true);
      setSuccessMessage("");
  
      await loginCustomer({ email, password });
  
      setSuccessMessage("Login successful! Redirecting...");
      setLoading(false);
  
      setTimeout(() => navigate("/customers"), 5000);
    } catch (err) {
      setLoading(false);
  
      const backendErrors = err.response?.data?.errors;
  
      if (Array.isArray(backendErrors)) {
        const mappedErrors = {};
        backendErrors.forEach((e) => {
          if (e.key && e.message) {
            mappedErrors[e.key] = e.message;
          }
        });
        setErrors(mappedErrors);
      } else {
        const fallbackMessage =
          err.response?.data?.message || err.message || "Login failed. Please try again.";
        setErrors({ general: fallbackMessage });
      }
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center mt-8 dark:bg-gray-900">
      <div className="flex dark:bg-gray-800 bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        {/* Left Form Section */}
        <div className="w-1/2 p-10">
          <h2 className="dark:text-white text-primary text-2xl font-semibold mb-4">Login</h2>

          <form onSubmit={handleLogin} noValidate>
            <label className="block dark:text-gray-400 text-maintext mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="name@mail.com"
              required
              className={`w-full p-3 rounded-md dark:bg-gray-700 dark:text-white text-subtitle border ${
                errors.email ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1`}
            />
            {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email}</p>}

            <label className="block dark:text-gray-400 text-maintext mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password")}
                placeholder="Input your password"
                required
                className={`w-full p-3 rounded-md dark:bg-gray-700 dark:text-white text-subtitle border ${
                  errors.password ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <span
                className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeFilled className="text-lg" /> : <EyeInvisibleFilled className="text-lg" />}
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 p-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-gray-400 mt-4 text-sm text-center">
            Forget your password?{" "}
            <a href="/customers/forgot-password" className="text-blue-400 hover:underline cursor-pointer">
              Reset Password here
            </a>
          </p>

          <p className="text-gray-400 mt-4 text-sm text-center">
            Don’t have an account?{" "}
            <a href="/customers/register" className="text-blue-400 hover:underline cursor-pointer">
              Sign Up here
            </a>
          </p>
        </div>

        {/* Right Welcome Section */}
        <div className="w-1/2 flex items-center justify-center dark:bg-gray-800 bg-white">
          <div className="border border-blue-600 py-24 px-10 rounded-lg text-center">
            <h2 className="text-blue-500 text-6xl font-bold">CAR HUNT</h2>
            <p className="dark:text-white text-lg my-4">Welcome to CAR HUNT</p>
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

export default Login;