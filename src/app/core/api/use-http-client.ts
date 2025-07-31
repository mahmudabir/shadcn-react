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

    let abortController: AbortController | null = new AbortController();

    function getSignal(): AbortSignal {
        if (!abortController) abortController = new AbortController();
        return abortController.signal;
    }

    function abortRequest() {
        abortController.abort();         // cancel current
        abortController = new AbortController(); // Reset
    }

    function isAbortError(error: any) {
    return error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED';
}

    async function getAll(props?: TQuery, signalOverride?: AbortSignal): Promise<Result<PagedData<T>>> {


        const query: Record<string, any> = { asPage: props?.asPage, asDropdown: props?.asDropdown };

        const res = await baseApi.get(apiBaseUrl, {
            signal: signalOverride ?? getSignal(),
            skipPreloader: props?.skipPreloader || false,
            params: query
        });
        return res.data;
    }

    async function getById(id: any, props?: TQuery, signalOverride?: AbortSignal): Promise<Result<T>> {

        const query: Record<string, any> = { ...props };

        const res = await baseApi.get(`${apiBaseUrl}/${id}`, {
            signal: signalOverride ?? getSignal(),
            skipPreloader: props?.skipPreloader || false,
            params: query
        });
        return res.data;
    }

    async function create(data: Omit<TCreate, 'id'>, props?: TQuery, signalOverride?: AbortSignal): Promise<Result<T>> {

        const query: Record<string, any> = { ...props };

        const res = await baseApi.post(apiBaseUrl, data, {
            signal: signalOverride ?? getSignal(),
            skipPreloader: props?.skipPreloader || false,
            params: query
        });
        return res.data;
    }

    async function update(id: any, data: TUpdate, props?: TQuery, signalOverride?: AbortSignal): Promise<Result<T>> {

        const query: Record<string, any> = { ...props };

        const res = await baseApi.put(`${apiBaseUrl}/${id}`, data, {
            signal: signalOverride ?? getSignal(),
            skipPreloader: props?.skipPreloader || false,
            params: query
        });
        return res.data;
    }

    async function remove(id: any, props?: TQuery, signalOverride?: AbortSignal): Promise<Result<boolean>> {

        const query: Record<string, any> = { ...props };

        const res = await baseApi.delete(`${apiBaseUrl}/${id}`, {
            signal: signalOverride ?? getSignal(),
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
        abortRequest,
        isAbortError
    }
}