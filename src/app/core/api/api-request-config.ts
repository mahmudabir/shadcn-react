import { Pagination } from "../models/pagination";
import { NavigateFunction } from "react-router-dom";

export const baseURL = (import.meta.env.VITE_BASE_API_URL as string) + "/api";

// Extend Axios config to allow skipPreloader
declare module 'axios' {
    export interface AxiosRequestConfig {
        skipPreloader?: boolean;
    }
}

export interface HttpOptions {
    skipPreloader?: boolean,
    pagination?: Pagination,
    queryKey?: string,
    signal?: AbortSignal,
    queryParams?: Record<string, any>
}

export let navigateFn: NavigateFunction | null = null;
export const setNavigateFunction = (navigateFunction: NavigateFunction) => {
  navigateFn = navigateFunction;
};

// Preloader handler for API calls
type PreloaderHandler = {
  increment: () => void;
  decrement: () => void;
};
export let preloaderHandler: PreloaderHandler | null = null;
export const setPreloaderHandler = (handler: PreloaderHandler) => {
  preloaderHandler = handler;
};