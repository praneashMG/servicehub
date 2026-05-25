import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://https://servicehub-sknv.onrender.com/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global Error Handling
    if (error.response) {
      if (error.response.status === 401) {
        // Only toast if it's not the initial verify token call or login call to avoid spam
        if (!error.config.url.includes('/auth/me') && !error.config.url.includes('/auth/login')) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } else if (error.response.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
        // Show specific error messages sent by the backend
        const message = error.response.data?.message;
        if (message) toast.error(message);
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    }
    return Promise.reject(error);
  }
);

export default api;
