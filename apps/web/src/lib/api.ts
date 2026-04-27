import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("@core:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor to handle common errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear session only if it was an expired token, not during login
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("@core:token");
        localStorage.removeItem("@core:user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
