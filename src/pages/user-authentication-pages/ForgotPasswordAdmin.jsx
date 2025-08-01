import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const ForgotPWAdmin = () => {
//   const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

    // const handleLogin = async (e) => {
    //   e.preventDefault();
    //   setError('');
    //   try {
    //     await login({ email, password });
    //     if (user?.role === "admin") {
    //       navigate("/admin");
    //     } else {
    //       navigate("/");
    //     }
    //   } catch (err) {
    //     const errorMessage =
    //     err.response?.data?.message ||
    //     err.message ||
    //     'Login failed. Please try again.';
    //   setError(errorMessage);
    //   }
    // };
    // useEffect(() => {
    //   if (user) {
    //     navigate(user.role === "admin" ? "/admin" : "/");
    //   }
    // }, [user, navigate]);

    const handleForgotPassword = async (e) => {
      
    }

  return (
    <div className="min-h-full flex items-center justify-center mt-8 dark:bg-gray-900">
      <div className="flex items-center dark:bg-gray-800 bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        {/* Left Form Section */}
        <div className="w-1/2 p-10">
          <h2 className="dark:text-white text-primary text-2xl font-semibold mb-4">Forgot Password</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleForgotPassword} noValidate>
            <label className="block dark:text-gray-400 text-maintext mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@mail.com"
              required
              className="w-full p-3 rounded-md dark:bg-gray-700 dark:text-white text-subtitle border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <button
              type="submit"
              className="w-full mt-6 p-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
            >
              Send Reset Password Email
            </button>
          </form>
        </div>

        {/* Right Welcome Section */}
        <div className="w-1/2 flex items-center justify-center dark:bg-gray-800 bg-white my-3">
          <div className="border border-blue-600 py-24 px-10 rounded-lg text-center">
            <h2 className="text-blue-500 text-6xl font-bold">CAR HUNT</h2>
            <p className="dark:text-white text-lg mt-4">Welcome to CAR HUNT</p>
            <h2 className="dark:text-white text-primary text-2xl font-semibold mt-4">Admin Portal</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPWAdmin;