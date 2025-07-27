import { createContext, useState, useEffect } from "react";
import axios from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  // 👤 CUSTOMER AUTH
  const loginCustomer = async ({ email, password }) => {
    try {
      const res = await axios.post("/customers/login", { email, password });
      const { token, ...userData } = res.data;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);
    } catch (err) {
      throw err;
    }
  };

  const registerCustomer = async ({ name, email, phone, password, dob, gender, confirmPassword }) => {
    try {
      const res = await axios.post("/customers/register", {
        name,
        email,
        phone,
        password,
        dob,
        gender,
        confirmPassword,
      });

      const { token, ...userData } = res.data;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);
    } catch (err) {
      throw err;
    }
  };

  // 🧑‍💼 ADMIN AUTH
  const loginAdmin = async ({ employeeCode, password }) => {
    try {
      const res = await axios.post("/admins/login", { employeeCode, password });
      const { token, ...userData } = res.data;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);
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
        confirmPassword,
      });

      const { token, ...userData } = res.data;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
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