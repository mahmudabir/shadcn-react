import { Pagination } from "../models/pagination";

// Extend Axios config to allow skipPreloader
declare module 'axios' {
    export interface AxiosRequestConfig {
        skipPreloader?: boolean;
    }
}

export interface HttpOptions {
    skipPreloader?: boolean,
    pagination?: Pagination,
    signal?: AbortSignal,
}