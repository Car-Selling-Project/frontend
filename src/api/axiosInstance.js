import axios from "axios";

// check chạy ở local hay production
const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "https://becarselling.onrender.com";

const instance = axios.create({
  baseURL,
});

// interceptor giữ nguyên
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
