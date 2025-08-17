import { PagedData } from "@/app/core/models/pagination.ts";
import { Result } from "@/app/core/models/result.ts";
import { HttpOptions } from "@/app/core/api/api-request-config.ts";
import baseAxios from "@/app/core/api/base-axios.ts";

export function useAxiosClient<
  T,
  TQuery extends HttpOptions = HttpOptions,
  TCreate = T,
  TUpdate = T
>(
  apiBaseUrl: string
) {

  async function getAll(props?: TQuery): Promise<Result<PagedData<T>>> {

    const query: Record<string, any> = { asPage: props?.pagination?.asPage, asDropdown: props?.pagination?.asDropdown };

    const res = await baseAxios.get(apiBaseUrl, {
      signal: props?.signal,
      skipPreloader: props?.skipPreloader || false,
      params: query
    });
    return res.data;
  }

  async function getById(id: any, props?: TQuery): Promise<Result<T>> {

    const query: Record<string, any> = { ...props?.queryParams };

    const res = await baseAxios.get(`${apiBaseUrl}/${id}`, {
      signal: props?.signal,
      skipPreloader: props?.skipPreloader || false,
      params: query
    });
    return res.data;
  }

  async function create(data: Omit<TCreate, 'id'>, props?: TQuery): Promise<Result<T>> {

    const query: Record<string, any> = { ...props };

    const res = await baseAxios.post(apiBaseUrl, data, {
      signal: props?.signal,
      skipPreloader: props?.skipPreloader || false,
      params: query
    });
    return res.data;
  }

  async function update(id: any, data: TUpdate, props?: TQuery): Promise<Result<T>> {

    const query: Record<string, any> = { ...props };

    const res = await baseAxios.put(`${apiBaseUrl}/${id}`, data, {
      signal: props?.signal,
      skipPreloader: props?.skipPreloader || false,
      params: query
    });
    return res.data;
  }

  async function remove(id: any, props?: TQuery): Promise<Result<boolean>> {

    const query: Record<string, any> = { ...props };

    const res = await baseAxios.delete(`${apiBaseUrl}/${id}`, {
      signal: props?.signal,
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