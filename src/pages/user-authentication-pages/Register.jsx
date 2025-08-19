import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import FormStatus from "../../components/FormStatus";

const Register = () => {
  const { registerCustomer } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [citizenId, setCitizenId] = useState("");
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
  const validateField = (field) => {
    switch (field) {
      case "name":
        if (!name.trim()) return "Full name is required";
        break;
      case "email":
        if (!email.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
        break;
      case "phone":
        if (!phone.trim()) return "Phone number is required";
        break;
      case "dob":
        if (!dob) return "Date of birth is required";
        break;
      case "gender":
        if (!gender) return "Please select a gender";
        break;
      case "address":
        if (!address) return "Address is required";
        break;
      case "citizenId":
        if (!citizenId) return "CitizenID is required";
        break;  
      case "password":
        if (!password) return "Password is required";
        break;
      case "confirmPassword":
        if (!confirmPassword) return "Please confirm your password";
        if (confirmPassword !== password) return "Passwords do not match";
        break;
      default:
        return null;
    }
    return null;
  };

  const handleBlurField = (field) => {
    const errorMsg = validateField(field);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const fields = ["name", "email", "phone", "dob", "gender", "password", "confirmPassword", "address" ,"citizenId"];
    fields.forEach((f) => {
      const msg = validateField(f);
      if (msg) newErrors[f] = msg;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});
      setLoading(true);
      setSuccessMessage("");

      await registerCustomer({ name, email, phone, password, dob, gender, confirmPassword, address, citizenId });

      setSuccessMessage("Registration successful! Redirecting...");
      setLoading(false);

      setTimeout(() => navigate("/customers/login"), 5000);
    } catch (err) {
      setLoading(false);
      const backendErrors = err.response?.data?.errors || [];
      const mappedErrors = {};
      backendErrors.forEach((e) => {
        mappedErrors[e.key] = e.message;
      });
      setErrors(mappedErrors);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center mt-8 dark:bg-gray-900">
      <div className="flex dark:bg-gray-800 bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl w-full">

        {/* Left Form Section */}
        <div className="w-1/2 p-10">
          <form onSubmit={handleRegister} noValidate>

            {/* Full Name */}
            <label className="block dark:text-gray-400 text-maintext mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onBlur={() => handleBlurField("name")}
              onChange={(e) => setName(e.target.value)}
              placeholder="Input your full name"
              required
              className={`w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white text-subtitle border ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

            {/* Email */}
            <label className="block dark:text-gray-400 text-maintext mb-2">Email</label>
            <input
              type="email"
              value={email}
              onBlur={() => handleBlurField("email")}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@mail.com"
              required
              className={`w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white text-subtitle border ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

            {/* Phone Number */}
            <label className="block dark:text-gray-400 text-maintext mb-2">Phone Number</label>
            <input
              type="text"
              value={phone}
              onBlur={() => handleBlurField("phone")}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0000-000-000"
              required
              className={`w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white text-subtitle border ${
                errors.phone ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.phone && <p className="text-red-500 text-sm mb-2">{errors.phone}</p>}

            {/* Date of Birth */}
            <label className="block dark:text-gray-400 text-maintext mb-2">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onBlur={() => handleBlurField("dob")}
              onChange={(e) => setDob(e.target.value)}
              required
              className={`w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white text-subtitle border ${
                errors.dob ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.dob && <p className="text-red-500 text-sm mb-2">{errors.dob}</p>}

            {/* Gender */}
            <label className="block dark:text-gray-400 text-maintext mb-2">Gender</label>
            <select
              value={gender}
              onBlur={() => handleBlurField("gender")}
              onChange={(e) => setGender(e.target.value)}
              required
              className={`w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white text-subtitle border ${
                errors.gender ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="" disabled hidden>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mb-2">{errors.gender}</p>}

            {/* Address */}
            <label className="block dark:text-gray-400 text-maintext mb-2">Address</label>
            <input
              type="text"
              value={address}
              onBlur={() => handleBlurField("address")}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Input your address"
              required
              className={`w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white text-subtitle border ${
                errors.address ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.address && <p className="text-red-500 text-sm mb-2">{errors.address}</p>}
            
            {/* CitizenId */}
            <label className="block dark:text-gray-400 text-maintext mb-2">CitizenID</label>
            <input
              type="text"
              value={citizenId}
              onBlur={() => handleBlurField("address")}
              onChange={(e) => setCitizenId(e.target.value)}
              placeholder="Input your citizenID"
              required
              className={`w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white text-subtitle border ${
                errors.citizenId ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.citizenId && <p className="text-red-500 text-sm mb-2">{errors.citizenId}</p>}

            {/* Password */}
            <label className="block dark:text-gray-400 text-maintext mb-2">Password</label>
            <div className="relative mb-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onBlur={() => handleBlurField("password")}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Input your password"
                required
                className={`w-full p-3 mb-4 rounded-md dark:bg-gray-700 dark:text-white text-subtitle border ${
                  errors.password ? 'border-red-500' : 'border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <span
                className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeFilled className="text-lg" /> : <EyeInvisibleFilled className="text-lg" />}
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

            {/* Confirm Password */}
            <label className="block dark:text-gray-400 text-maintext mb-2">Confirm Password</label>
            <div className="relative mb-1">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onBlur={() => handleBlurField("confirmPassword")}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className={`w-full p-3 rounded-md mb-4 dark:bg-gray-700 dark:text-white text-subtitle border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <span
                className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showPassword ? <EyeFilled className="text-lg" /> : <EyeInvisibleFilled className="text-lg" />}
              </span>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mb-2">{errors.confirmPassword}</p>}

            <button
              type="submit"
              className="w-full mt-6 p-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
              disabled={loading}
            >
              {loading ? "Registering..." : "Create My Account"}
            </button>
          </form>

          <p className="text-gray-400 mt-4 text-sm text-center">
            Already have an account?{" "}
            <a href="/customers/login" className="text-blue-400 hover:underline cursor-pointer">
              Login here
            </a>
          </p>
        </div>

        {/* Right Section */}
        <div className="w-1/2 flex items-center justify-center dark:bg-gray-800 bg-white">
          <div className="border border-blue-600 py-24 px-20 rounded-lg text-center">
            <h2 className="text-blue-500 text-6xl font-bold">CAR HUNT</h2>
            <p className="dark:text-white text-lg mt-4">Welcome to CAR HUNT</p>
            <h2 className="dark:text-white text-primary text-4xl font-semibold my-6">Sign Up</h2>
            {/* FormStatus Component */}
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

export default Register;