import { PagedData, Pagination } from "../models/pagination";
import { Result } from "../models/result";
import baseApi from "./base-api";
import { HttpOptions } from "@/app/core/api/axios-request-config.ts";

export function useHttpClient<
    T,
    TQuery extends HttpOptions,
    TCreate = T,
    TUpdate = T
>(
    apiBaseUrl: string
) {

    // let abortController: AbortController | null = new AbortController();

    // function getSignal(): AbortSignal {
    //     if (!abortController) abortController = new AbortController();
    //     return abortController.signal;
    // }

    // function abortRequest() {
    //     if (abortController) abortController.abort();         // cancel current
    //     else throw new Error("abortController is null");
    //     abortController = new AbortController(); // Reset
    // }

    // function isAbortError(error: any) {
    //     return error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED';
    // }

    async function getAll(props?: TQuery): Promise<Result<PagedData<T>>> {

        const query: Record<string, any> = { asPage: props?.pagination?.asPage, asDropdown: props?.pagination?.asDropdown };

        const res = await baseApi.get(apiBaseUrl, {
            signal: props.signal, //?? getSignal(),
            skipPreloader: props?.skipPreloader || false,
            params: query
        });
        return res.data;
    }

    async function getById(id: any, props?: TQuery): Promise<Result<T>> {

        const query: Record<string, any> = { ...props };

        const res = await baseApi.get(`${apiBaseUrl}/${id}`, {
            signal: props.signal, //?? getSignal(),
            skipPreloader: props?.skipPreloader || false,
            params: query
        });
        return res.data;
    }

    async function create(data: Omit<TCreate, 'id'>, props?: TQuery): Promise<Result<T>> {

        const query: Record<string, any> = { ...props };

        const res = await baseApi.post(apiBaseUrl, data, {
            signal: props.signal, //?? getSignal(),
            skipPreloader: props?.skipPreloader || false,
            params: query
        });
        return res.data;
    }

    async function update(id: any, data: TUpdate, props?: TQuery): Promise<Result<T>> {

        const query: Record<string, any> = { ...props };

        const res = await baseApi.put(`${apiBaseUrl}/${id}`, data, {
            signal: props.signal, //?? getSignal(),
            skipPreloader: props?.skipPreloader || false,
            params: query
        });
        return res.data;
    }

    async function remove(id: any, props?: TQuery): Promise<Result<boolean>> {

        const query: Record<string, any> = { ...props };

        const res = await baseApi.delete(`${apiBaseUrl}/${id}`, {
            signal: props.signal, //?? getSignal(),
            skipPreloader: props?.skipPreloader || false,
            params: query
        });
        return res.data;
    }

    return {
        getAll,
        getById,
        create,
        update,
        remove,
        // abortRequest,
        // isAbortError
    }
}