import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useTanstackViewModel, TanstackViewModelOptions } from "../../../core/hooks/use-tanstack-view-model";
import { City } from "../models/city";
import { QUERY_STALE_TIME } from "../../../../lib/utils";

// MVVM ViewModel for City using Tanstack Query
export function useCities(options?: TanstackViewModelOptions<City>) {

  const apiBaseUrl = '/cities';
  const queryClient: QueryClient = useQueryClient();

  options ??= {
    queryClient: queryClient,
    query: {
      getAll: (query: any) => ({
        staleTime: QUERY_STALE_TIME,
        gcTime: QUERY_STALE_TIME,
        queryKey: [apiBaseUrl],
        enabled: true,
        onSuccess: (data) => {
          console.log("getAll->onSuccess: ", data);
        }
      }),
      getById: (id) => ({
        staleTime: QUERY_STALE_TIME,
        gcTime: QUERY_STALE_TIME,
        queryKey: [apiBaseUrl, id],
        enabled: !!id,
        onSuccess: (data) => {
          console.log("getById->onSuccess: ", data);
        }
      }),
      getSelectItems: (label: keyof City, value: keyof City, placeholder?: string, query?: any) => ({
        staleTime: QUERY_STALE_TIME,
        gcTime: QUERY_STALE_TIME,
        queryKey: [apiBaseUrl],
        enabled: true,
        onSuccess: (data, placeholder?: string) => {
          console.log("getSelectItems->onSuccess: ", data);
        }
      }),
    },
    mutation: {
      create: {
        onSuccess: (res, values, context) => {
          queryClient.invalidateQueries({ queryKey: [apiBaseUrl]/*, refetchType: "none"*/ })
        },
      },
      update: {
        onSuccess: (res, values, context) => {
          const id = res.payload?.id;
          if (id) {
            queryClient.invalidateQueries({ queryKey: [apiBaseUrl]/*, refetchType: "none"*/ });
            queryClient.invalidateQueries({ queryKey: [apiBaseUrl, id]/*, refetchType: "none"*/ });
          }
        },
      },
      remove: {
        onSuccess: (res, values, context) => {
          queryClient.invalidateQueries({ queryKey: [apiBaseUrl]/*, refetchType: "none"*/ });
        },
      },
    }
  }

  return useTanstackViewModel<City, any>(apiBaseUrl, options);
}