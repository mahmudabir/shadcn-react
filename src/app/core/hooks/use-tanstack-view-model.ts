import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';
import { PagedData } from '../models/pagination';
import { Result } from '../models/result';
import { SelectOption } from '../models/select-option';
import { HttpOptions } from '../api/api-request-config.ts';
import { useFetchClient } from "@/app/core/api/use-fetch-client.ts";

export interface TanstackViewModelOptions<
  T,
  TQuery extends HttpOptions = HttpOptions,
  TCreate = T,
  TUpdate = T
> {
  queryClient: QueryClient,
  query?: {
    getAll?: (query?: TQuery) => UseQueryOptions<
      Result<PagedData<T>>,
      unknown,
      Result<PagedData<T>>,
      any[]
    > & { onSuccess?: (data: Result<PagedData<T>>) => void; };
    getById?: (id?: any) => UseQueryOptions<
      Result<T>,
      unknown,
      Result<T>,
      any[]
    > & { onSuccess?: (data: Result<T>) => void; };
    getSelectItems?: (label: keyof T, value: keyof T, placeholder?: string, query?: TQuery) => UseQueryOptions<
      SelectOption[],
      unknown,
      SelectOption[],
      any[]
    > & { onSuccess?: (data: SelectOption[], placeholder?: string) => void; };
  };
  mutation?: {
    create?: UseMutationOptions<Result<T>, unknown, TCreate>;
    update?: UseMutationOptions<Result<T>, unknown, TUpdate>;
    remove?: UseMutationOptions<Result<boolean>, unknown, any>;
  };
}

export function useTanstackViewModel<
  T extends { id?: any },
  TQuery extends HttpOptions,
  TCreate = T,
  TUpdate = T
>(
  apiBaseUrl: string,
  options?: TanstackViewModelOptions<T, TQuery, TCreate, TUpdate>
) {

  const queryClient = options.queryClient ?? useQueryClient();
  const api = useFetchClient<T, TQuery, TCreate, TUpdate>(apiBaseUrl);

  const getAll = (query?: TQuery) => {
    const customOptions = options?.query?.getAll?.(query) ?? { onSuccess: (data: Result<PagedData<T>>) => { } };
    const customQueryKey = query?.queryKey ? [query.queryKey] : [apiBaseUrl];
    return useQuery<Result<PagedData<T>>, unknown>({
      queryKey: customQueryKey,
      queryFn: async ({ signal }) => {
        if (query) query.signal = signal ?? query?.signal;
        else query = { signal: signal } as TQuery;
        const result = await api.getAll(query);
        if (customOptions.onSuccess) {
          customOptions.onSuccess(result);
        }
        return result;
      },
      enabled: true,
      ...(options?.query?.getAll ? options?.query.getAll(query) : {}),
    });
  }

  const getById = (id?: any, query?: TQuery) => {
    const customOptions = options?.query?.getById?.(id) ?? { onSuccess: (data: Result<T>) => { } };
    const customQueryKey = query?.queryKey ? [query.queryKey] : [apiBaseUrl, id];
    return useQuery<Result<T>, unknown>({
      queryKey: customQueryKey,
      queryFn: async ({ signal }) => {
        if (query) query.signal = signal ?? query?.signal;
        else query = { signal: signal } as TQuery;
        const result = await api.getById(id, query);
        if (customOptions.onSuccess) {
          customOptions.onSuccess(result);
        }
        return result;
      },
      enabled: !!id,
      ...(options?.query?.getById ? options?.query.getById(id) : {}),
    })
  };

  const getSelectItems = (label: keyof T, value: keyof T, placeholder?: string, query?: TQuery) => {
    const customOptions = options?.query?.getSelectItems(label, value, placeholder, query) ?? { onSuccess: (data: SelectOption[], placeholder?: string) => { } };
    const customQueryKey = query?.queryKey ? [query.queryKey] : [apiBaseUrl, 'selectItems'];
    return useQuery<SelectOption[], unknown>({
      queryKey: customQueryKey,
      queryFn: async ({ signal }) => {
        if (query) query.signal = signal ?? query?.signal;
        else query = { ...query, signal: signal };
        // Below is equivalent to => // const result = await api.getAll(query); //result.payload.content;
        const { payload: { content: data = [] = [] } = {} } = await api.getAll({ ...query, asDropdown: true });

        const selectItems = generateSelectOptions(data, label, value, placeholder);

        if (customOptions.onSuccess) {
          customOptions.onSuccess(selectItems, placeholder);
        }
        return selectItems;
      },
      enabled: true,
      ...(options?.query?.getSelectItems ? options?.query.getSelectItems(label, value, placeholder, query) : {}),
    });
  }

  const create = (query?: TQuery) => useMutation<Result<T>, unknown, TCreate>({
    mutationFn: (data) => api.create(data, query),
    ...options?.mutation?.create,
  });

  const update = (query?: TQuery) => useMutation<Result<T>, unknown, TUpdate & { id?: any }>({
    mutationFn: (data) => api.update(data.id, data, query),
    ...options?.mutation?.update,
  });

  const remove = (query?: TQuery) => useMutation<Result<boolean>, unknown, string>({
    mutationFn: (id: any) => api.remove(id, query),
    ...options?.mutation?.remove,
  });

  return {
    queryClient,
    getAll,
    getById,
    getSelectItems,
    create,
    update,
    remove,
  };
}

/* Reusable Select Generator */
export const generateSelectOptions = <T>(items: T[], labelKey: keyof T, valueKey: keyof T, placeholder?: string): SelectOption[] => {
  return [
    { label: placeholder ?? 'Select an option', value: undefined },
    ...items.map(item => ({
      label: String(item[labelKey]),
      value: String(item[valueKey]),
    })),
  ];
};