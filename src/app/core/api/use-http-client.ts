import { PagedData, Pagination } from "../models/pagination";
import { Result } from "../models/result";
import baseApi from "./base-api";

export function useHttpClient<
    T,
    TQuery extends Pagination & { skipPreloader?: boolean },
    TCreate = T,
    TUpdate = T
>(
    apiBaseUrl: string
) {



    async function getAll(props?: TQuery): Promise<Result<PagedData<T>>> {

        const query: Record<string, any> = { asPage: props?.asPage, asDropdown: props?.asDropdown };

        const res = await baseApi.get(apiBaseUrl, {
            skipPreloader: props?.skipPreloader || false,
            params: query
        });
        return res.data;
    }

    async function getById(id: any): Promise<Result<T>> {
        const res = await baseApi.get(`${apiBaseUrl}/${id}`);
        return res.data;
    }

    async function create(data: Omit<TCreate, 'id'>): Promise<Result<T>> {
        const res = await baseApi.post(apiBaseUrl, data);
        return res.data;
    }

    async function update(id: any, data: TUpdate): Promise<Result<T>> {
        const res = await baseApi.put(`${apiBaseUrl}/${id}`, data);
        return res.data;
    }

    async function remove(id: any): Promise<Result<boolean>> {
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