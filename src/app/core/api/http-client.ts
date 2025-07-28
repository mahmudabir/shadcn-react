import { PagedData } from "../models/pagination";
import { Result } from "../models/result";
import baseApi from "./base-api";

export function useHttpClient<T, TCreate, TUpdate>(apiBaseUrl: string) {

    async function getAll(): Promise<Result<PagedData<T>>> {
        const res = await baseApi.get(apiBaseUrl, { skipPreloader: false });
        return res.data;
    }

    async function getById(id: string): Promise<Result<T>> {
        const res = await baseApi.get(`${apiBaseUrl}/${id}`);
        return res.data;
    }

    async function create(data: Omit<TCreate, 'id'>): Promise<Result<T>> {
        const res = await baseApi.post(apiBaseUrl, data);
        return res.data;
    }

    async function update(id: string, data: Omit<TUpdate, 'id'>): Promise<Result<T>> {
        const res = await baseApi.put(`${apiBaseUrl}/${id}`, data);
        return res.data;
    }

    async function remove(id: string): Promise<Result<boolean>> {
        const res = await baseApi.delete(`${apiBaseUrl}/${id}`);
        return res.data;
    }

    return {
        getAll,
        getById,
        create,
        update,
        remove
    }
}