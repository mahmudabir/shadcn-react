import { QueryClient, useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useHttpClient } from '../api/use-http-client';
import { PagedData, Pagination } from '../models/pagination';
import { Result } from '../models/result';

export interface TanstackViewModelOptions<
  T,
  TQuery extends Pagination & { skipPreloader?: boolean },
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
  };
  mutation?: {
    create?: UseMutationOptions<Result<T>, unknown, TCreate>;
    update?: UseMutationOptions<Result<T>, unknown, TUpdate>;
    remove?: UseMutationOptions<Result<boolean>, unknown, any>;
  };
}

export function useTanstackViewModel<
  T extends { id?: any },
  TQuery extends Pagination & { skipPreloader?: boolean },
  TCreate = T,
  TUpdate = T
>(
  apiBaseUrl: string,
  options?: TanstackViewModelOptions<T, TQuery, TCreate, TUpdate>
) {

  const queryClient = options.queryClient ?? useQueryClient();
  const api = useHttpClient<T, TQuery, TCreate, TUpdate>(apiBaseUrl);

  const defaultQueryOptions: Partial<UseQueryOptions<any, unknown, any, any[]>> = {
    refetchOnWindowFocus: false,
    retry: 3,
  };

  const getAll = (query?: TQuery) => {
    const customOptions = options?.query?.getAll?.(query) ?? { onSuccess: (data: Result<PagedData<T>>) => { } };
    return useQuery<Result<PagedData<T>>, unknown>({
      queryKey: [apiBaseUrl],
      queryFn: async () => {
        const result = await api.getAll(query);
        if (customOptions.onSuccess) {
          customOptions.onSuccess(result);
        }
        return result;
      },
      enabled: true,
      ...defaultQueryOptions,
      ...(options?.query?.getAll ? options?.query.getAll(query) : {}),
    });
  }

  const getById = (id: string) => {
    const customOptions = options?.query?.getById?.(id) ?? { onSuccess: (data: Result<T>) => { } };
    return useQuery<Result<T>, unknown>({
      queryKey: [apiBaseUrl, id],
      queryFn: async () => {
        const result = await api.getById(id);
        if (customOptions.onSuccess) {
          customOptions.onSuccess(result);
        }
        return result;
      },
      enabled: !!id,
      ...defaultQueryOptions,
      ...(options?.query?.getById ? options?.query.getById(id) : {}),
    })
  };

  const create = useMutation<Result<T>, unknown, TCreate>({
    mutationFn: (data) => api.create(data),
    ...options?.mutation?.create,
  });

  const update = useMutation<Result<T>, unknown, TUpdate & { id?: any }>({
    mutationFn: (data) => api.update(data.id, data),
    ...options?.mutation?.update,
  });

  const remove = useMutation<Result<boolean>, unknown, string>({
    mutationFn: (id: any) => api.remove(id),
    ...options?.mutation?.remove,
  });

  return {
    getAll,
    getById,
    create,
    update,
    remove,
  };
}