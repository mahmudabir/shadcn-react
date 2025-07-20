import { AxiosRequestConfig } from "axios";

// Extend Axios config to allow skipPreloader
declare module 'axios' {
    export interface AxiosRequestConfig {
        skipPreloader?: boolean;
    }
}