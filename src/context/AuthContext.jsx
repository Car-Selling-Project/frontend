import { createContext, useState, useEffect } from "react";
import axios from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const accessToken = localStorage.getItem("accessToken");
    if (storedUser && accessToken) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  // 👤 CUSTOMER AUTH
  const loginCustomer = async ({ email, password }) => {
    try {
      const res = await axios.post("/customers/login", { email, password });
      const { message, accessToken, refreshToken, customer } = res.data;

      if (!accessToken) {
        throw new Error("No access token received");
      }
      const userData = {
        ...customer,
        role: "customer"
      };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(userData);
      return { accessToken, refreshToken, user: userData };
    } catch (err) {
      throw err;
    }
  };

  const registerCustomer = async ({ name, email, phone, password, dob, gender, confirmPassword, address, citizenId }) => {
    try {
      const res = await axios.post("/customers/register", {
        name,
        email,
        phone,
        password,
        dob,
        gender,
        confirmPassword,
        address,
        citizenId
      }, { withCredentials: true });

      const { accessToken, refreshToken, customer } = res.data;

    const userData = {
      ...customer,
      role: "customer"
    };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(userData);
      return { accessToken, refreshToken, user: userData };
    } catch (err) {
      throw err;
    }
  };

  // 🧑‍💼 ADMIN AUTH
  const loginAdmin = async ({ employeeCode, password }) => {
    try {
      const res = await axios.post("/admins/login", { employeeCode, password }, { withCredentials: true });
      const { accessToken, refreshToken, admin } = res.data;

      const userData = {
        ...admin,
        role: "admin"
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(userData);
      return { accessToken, refreshToken, user: userData };
    } catch (err) {
      throw err;
    }
  };

  const registerAdmin = async ({ name, email, phone, password, dob, gender, confirmPassword }) => {
    try {
      const res = await axios.post("/admins/register", {
        name,
        email,
        phone,
        password,
        dob,
        gender,
        confirmPassword
      }, { withCredentials: true });

      const { accessToken, refreshToken, admin } = res.data;

      const userData = {
        ...admin,
        role: "admin"
      };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(userData);
      return { accessToken, refreshToken, user: userData };
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginCustomer,
        registerCustomer, 
        loginAdmin,
        registerAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};