import { Result } from "@/app/core/models/result.ts";
import { AUTH_PATHS } from "@/app/modules/auth/routes/auth-paths.ts";
import { ACCESS_TOKEN_KEY, getRefreshTokenFormData, logout, REFRESH_TOKEN_KEY, setLoginData } from "@/lib/authUtils.ts";
import { getErrorMessages } from "@/lib/formUtils";
import { toastError } from "@/lib/toasterUtils.tsx";
import axios, { AxiosResponse } from "axios";

import { NavigateFunction } from "react-router-dom";

export const baseApi = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export let navigateFn: NavigateFunction | null = null;
export const setNavigateFunction = (navigateFunction: NavigateFunction) => {
    navigateFn = navigateFunction;
};

// Preloader handler for API calls
type PreloaderHandler = {
    increment: () => void;
    decrement: () => void;
    isManual: boolean;
};
let preloaderHandler: PreloaderHandler | null = null;
export const setPreloaderHandler = (handler: PreloaderHandler) => {
    preloaderHandler = handler;
};

// Request interceptor to add the JWT token and trigger preloader
baseApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        // Allow skipping preloader for specific requests
        if (preloaderHandler && !preloaderHandler.isManual && !config.skipPreloader) {
            preloaderHandler.increment();
        }
        return config;
    },
    (error) => {
        if (preloaderHandler && !preloaderHandler.isManual && !(error.config && error.config.skipPreloader)) {
            preloaderHandler.decrement();
        }
        return Promise.reject(error);
    }
);

// Response interceptor for refresh token logic and preloader
baseApi.interceptors.response.use(
    (response: AxiosResponse<Result<any>, any>) => {
        if (preloaderHandler && !preloaderHandler.isManual && !(response.config && response.config.skipPreloader)) {
            preloaderHandler.decrement();
        }
        if (response && !response.data.isSuccess) {
            toastError(getErrorMessages(response.data), response.data?.message || 'Failed to perform action');
        }
        return response;
    },
    async (error) => {
        if (preloaderHandler && !preloaderHandler.isManual) {
            preloaderHandler.decrement();
        }

        // Don't display errors for aborted requests
        if (axios.isCancel(error)) {
            console.log('Request canceled:', error.message);
            return Promise.reject(error);
        }
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
                const res = await axios.post(`/auth/token`, getRefreshTokenFormData(refreshToken));
                const { access_token, refresh_token } = res.data;
                setLoginData(access_token, refresh_token);
                originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
                return baseApi(originalRequest);
            } catch (refreshError) {
                logout();
                if (navigateFn) {
                    navigateFn(AUTH_PATHS.login());
                } else {
                    window.location.href = AUTH_PATHS.login(); // Fallback
                }

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default baseApi;