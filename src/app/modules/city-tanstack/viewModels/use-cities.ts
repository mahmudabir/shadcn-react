import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useTanstackViewModel, TanstackViewModelOptions } from "../../../core/hooks/use-tanstack-view-model";
import { City } from "../models/city";

// MVVM ViewModel for City using Tanstack Query
export function useCities(options?: TanstackViewModelOptions<City, any>) {

  const apiBaseUrl = '/cities';
  const queryClient: QueryClient = useQueryClient();

  options ??= {
    queryClient: queryClient,
    query: {
      getAll: (query: any) => ({
        staleTime: 10_000,
        queryKey: [apiBaseUrl],
        enabled: true,
        onSuccess: (data) => {
          // console.log("getAll->onSuccess: ", data);
        }
      }),
      getById: (id) => ({
        staleTime: 10_000,
        queryKey: [apiBaseUrl, id],
        enabled: !!id,
        onSuccess: (data) => {
          // console.log("getById->onSuccess: ", data);
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