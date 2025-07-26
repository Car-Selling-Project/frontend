import { createContext, useState, useEffect } from "react";
import axios from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  // Check user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(storedUser);
      setIsLoading(false);
    }
  }, []);

  const login = async ({ email, password }) => {
    try {
      const res = await axios.post("/customers/login", { email, password });
      const { token, ...userData } = res.data;

      // Save to local
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);
    } catch (err) {
      throw err;
    }
  };

  const register = async ({ name, email, phone, password, dob, gender }) => {
    try {
      const res = await axios.post("/customers/register", {
        name,
        email,
        phone,
        password,
        dob,
        gender
      });

      const { token, ...userData } = res.data;

      // Save to local
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
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};