import { createContext, useState, useEffect } from "react";
import axios from "../api/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem("user"));
  //   const token = localStorage.getItem("accessToken");
  //   if (storedUser && token) {
  //     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //     setUser(storedUser);
  //   }
  //   setIsLoading(false);
  // }, []);

  useEffect(() => {
  const storedToken = localStorage.getItem("accessToken"); // <--- fix key
  const storedUser = localStorage.getItem("user");
  if (storedToken) setToken(storedToken);
  if (storedUser) setUser(JSON.parse(storedUser));
  setIsLoading(false); // Don't forget to set loading to false!
}, []);

  // 🧑‍💼 ADMIN AUTH
  const loginAdmin = async ({ employeeCode, password }) => {
    try {
      const res = await axios.post("/admins/login", { employeeCode, password });
      const { accessToken, refreshToken, ...userData } = res.data;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      setToken(accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
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

      const { accessToken, refreshToken, ...userData } = res.data;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      setToken(accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      setUser(userData);
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        loginAdmin,
        registerAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};