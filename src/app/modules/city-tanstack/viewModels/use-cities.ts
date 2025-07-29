import { useTanstackViewModel, TanstackViewModelOptions } from "../../../core/hooks/use-tanstack-view-model";
import { City } from "../../city/models/city";

// MVVM ViewModel for City using Tanstack Query
export function useCities(options: TanstackViewModelOptions<City, City, City> = {}) {

  const apiBaseUrl = '/cities';

  return useTanstackViewModel<City, City, City>(apiBaseUrl, {
    query: {
      getAll: { staleTime: 10_000, queryKey: [apiBaseUrl] },
      getById: (id) => ({ staleTime: 10_000, enabled: !!id, queryKey: [apiBaseUrl, '/' , id] }),
    },
  });
}