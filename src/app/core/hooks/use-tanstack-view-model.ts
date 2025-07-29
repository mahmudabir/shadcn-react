import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useHttpClient } from '../api/use-http-client';
import { PagedData } from '../models/pagination';
import { Result } from '../models/result';

export interface TanstackViewModelOptions<T, TCreate = T, TUpdate = T> {
  query?: {
    getAll?: UseQueryOptions<Result<PagedData<T>>, unknown, Result<PagedData<T>>, any[]>;
    getById?: (id?: any) => UseQueryOptions<Result<T>, unknown, Result<T>, any[]>;
  };
  mutation?: {
    create?: UseMutationOptions<Result<T>, unknown, TCreate>;
    update?: UseMutationOptions<Result<T>, unknown, TUpdate>;
    remove?: UseMutationOptions<Result<boolean>, unknown, any>;
  };
}

export function useTanstackViewModel<T extends { id?: any }, TCreate = T, TUpdate = T>(
  apiBaseUrl: string,
  options: TanstackViewModelOptions<T, TCreate, TUpdate> = {}
) {
  const queryClient = useQueryClient();
  const api = useHttpClient<T, TCreate, TUpdate>(apiBaseUrl);

  const getAll = useQuery<Result<PagedData<T>>, unknown>({
    queryKey: [apiBaseUrl],
    queryFn: () => api.getAll(),
    ...options.query?.getAll,
  });

  const getById = (id: string) =>
    useQuery<Result<T>, unknown>({
      queryKey: [apiBaseUrl, id],
      queryFn: () => api.getById(id),
      enabled: !!id,
      ...(options.query?.getById ? options.query.getById(id) : {}),
    });

  const create = useMutation<Result<T>, unknown, TCreate>({
    mutationFn: (data) => api.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [apiBaseUrl] }),
    ...options.mutation?.create,
  });

  const update = useMutation<Result<T>, unknown, TUpdate & { id?: any }>({
    mutationFn: (data) => api.update(data.id, data),
    onSuccess: (res) => {
      const id = res.payload?.id;
      if (id) {
        queryClient.invalidateQueries({ queryKey: [apiBaseUrl] });
        queryClient.invalidateQueries({ queryKey: [apiBaseUrl, id] });
      }
    },
    ...options.mutation?.update,
  });

  const remove = useMutation<Result<boolean>, unknown, string>({
    mutationFn: (id: any) => api.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [apiBaseUrl] }),
    ...options.mutation?.remove,
  });

  return {
    getAll,
    getById,
    create,
    update,
    remove,
  };
}