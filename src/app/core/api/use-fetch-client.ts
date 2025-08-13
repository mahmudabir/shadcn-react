import { PagedData } from "../models/pagination";
import { Result } from "../models/result";
import baseFetch from "./base-fetch";
import { HttpOptions } from "@/app/core/api/api-request-config.ts";

export function useFetchClient<
    T,
    TQuery extends HttpOptions = HttpOptions,
    TCreate = T,
    TUpdate = T
>(
    apiBaseUrl: string
) {
    async function getAll(props?: TQuery): Promise<Result<PagedData<T>>> {
        const query: Record<string, any> = {
            asPage: props?.pagination?.asPage,
            asDropdown: props?.pagination?.asDropdown
        };

        const res = await baseFetch.get<Result<PagedData<T>>>(apiBaseUrl, {
            signal: props?.signal,
            skipPreloader: props?.skipPreloader || false,
            params: query
        });
        return res;
    }

    async function getById(id: any, props?: TQuery): Promise<Result<T>> {
        const query: Record<string, any> = { ...props?.queryParams };

        const res = await baseFetch.get<Result<T>>(`${apiBaseUrl}/${id}`, {
            signal: props?.signal,
            skipPreloader: props?.skipPreloader || false,
            params: query
        });
        return res;
    }

    async function create(data: Omit<TCreate, "id">, props?: TQuery): Promise<Result<T>> {
        const query: Record<string, any> = { ...props };

        const res = await baseFetch.post<Result<T>>(apiBaseUrl, data, {
            signal: props?.signal,
            skipPreloader: props?.skipPreloader || false,
            params: query
        });
        return res;
    }

    async function update(id: any, data: TUpdate, props?: TQuery): Promise<Result<T>> {
        const query: Record<string, any> = { ...props };

        const res = await baseFetch.put<Result<T>>(`${apiBaseUrl}/${id}`, data, {
            signal: props?.signal,
            skipPreloader: props?.skipPreloader || false,
            params: query
        });
        return res;
    }

    async function remove(id: any, props?: TQuery): Promise<Result<boolean>> {
        const query: Record<string, any> = { ...props };

        const res = await baseFetch.delete<Result<boolean>>(`${apiBaseUrl}/${id}`, {
            signal: props?.signal,
            skipPreloader: props?.skipPreloader || false,
            params: query
        });
        return res;
    }

    async function streamEvents<TData = any>(
        path?: string,
        props?: TQuery & {
            method?: "GET" | "POST";
            body?: any;
            onMessage?: (message: { event?: string; data: TData; id?: string; retry?: number; raw: string }) => void;
            onError?: (error: any) => void;
        }
    ): Promise<{ close: () => void }> {
        const endpoint = path ? `${apiBaseUrl}/${path}` : `${apiBaseUrl}/stream`;
        const query: Record<string, any> = { ...props?.queryParams };

        return await baseFetch.eventStream<TData>(endpoint, {
            method: props?.method || "GET",
            body: props?.body,
            signal: props?.signal,
            skipPreloader: props?.skipPreloader ?? true,
            params: query,
            onMessage: props?.onMessage,
            onError: props?.onError
        });
    }

    return {
        getAll,
        getById,
        create,
        update,
        remove,
        streamEvents
    };
}
