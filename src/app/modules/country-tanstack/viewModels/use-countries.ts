import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { TanstackViewModelOptions, useTanstackViewModel } from "@/app/core/hooks/use-tanstack-view-model.ts";
import { Country } from "@/app/modules/country-tanstack/models/country.ts";
import { HttpOptions } from "@/app/core/api/api-request-config.ts";

// MVVM ViewModel for Country using Tanstack Query
export function useCountries(options?: TanstackViewModelOptions<Country>) {

  const apiBaseUrl = '/countries';
  const queryClient: QueryClient = useQueryClient();

  options ??= {
    queryClient: queryClient,
    query: {
      getAll: (query?: HttpOptions) => ({
        // staleTime: QUERY_STALE_TIME,
        queryKey: [apiBaseUrl],
        enabled: true,
        onSuccess: (data) => {
          console.log("getAll->onSuccess: ", data);
        }
      }),
      getById: (id?: any, query?: HttpOptions) => ({
        // staleTime: QUERY_STALE_TIME,
        queryKey: [apiBaseUrl, id],
        enabled: !!id,
        onSuccess: (data) => {
          console.log("getById->onSuccess: ", data);
        }
      }),
      getSelectItems: (label: keyof Country, value: keyof Country, placeholder?: string, query?: HttpOptions) => ({
        // staleTime: QUERY_STALE_TIME,
        queryKey: [apiBaseUrl, 'selectItems'],
        enabled: true,
        onSuccess: (data, placeholder?: string) => {
          console.log("getSelectItems->onSuccess: ", placeholder, data);
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

  return useTanstackViewModel<Country, any>(apiBaseUrl, options);
}