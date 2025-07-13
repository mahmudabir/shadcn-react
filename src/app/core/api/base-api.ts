import axios from "axios";
import { ACCESS_TOKEN_KEY, getRefreshTokenFormData, logout, REFRESH_TOKEN_KEY, setLoginData } from "@/lib/authUtils.ts";

const API_BASE = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json"
  }
});

export let navigateToLogin = null;


export const setNavigateFunction = (navigateFn) => {
  navigateToLogin = navigateFn;
};

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for refresh token logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        const res = await axios.post(`${API_BASE}/auth/token`, getRefreshTokenFormData(refreshToken));
        const { access_token, refresh_token } = res.data;
        setLoginData(access_token, refresh_token);
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        logout();
        if (navigateToLogin) {
          navigateToLogin("/login");
        } else {
          window.location.href = "/login"; // Fallback
        }

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;