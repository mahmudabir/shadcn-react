import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useHttpClient } from '../api/http-client';
import { SelectOption } from '../models/select-option';

export interface TanstackViewModelOptions {
  queryKey?: string[];
  staleTime?: number;
  cacheTime?: number;
  retry?: number | boolean;
  retryDelay?: number | ((attemptIndex: number) => number);
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  refetchOnMount?: boolean;
}

/**
 * Generic CRUD ViewModel hook with Tanstack Query features
 * Provides caching, retrying, and other Tanstack Query benefits
 */
/**
 * Generic CRUD ViewModel hook with Tanstack Query features
 * @template T - Entity type
 * @template TCreate - Create payload type
 * @template TUpdate - Update payload type
 * @param apiBaseUrl - API base URL for the entity
 * @param options - TanstackViewModelOptions for queries/mutations
 * @param itemId - Optional item ID for single item query
 * @returns All queries, mutations, helpers, and states for the entity
 */
export function useTanstackViewModel<T, TCreate = Omit<T, 'id'>, TUpdate = Omit<T, 'id'>>(
  apiBaseUrl: string,
  options: TanstackViewModelOptions = {},
  itemId?: string
) {
  const queryClient = useQueryClient();
  const httpClient = useHttpClient<T, TCreate, TUpdate>(apiBaseUrl);
  
  const [message, setMessage] = useState<string | null>(null);
  const [selectItems, setSelectItems] = useState<SelectOption[]>([]);

  // Default query key
  const defaultQueryKey = useMemo(() => [apiBaseUrl, 'entities'], [apiBaseUrl]);
  const queryKey = options.queryKey || defaultQueryKey;

  // Default options
  const defaultOptions = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    ...options
  };

  // Query for all items
  const itemsQuery = useQuery({
    queryKey: [...queryKey, 'all'],
    queryFn: async () => {
      const res = await httpClient.getAll();
      if (!res.isSuccess) {
        throw new Error(res.message || 'Failed to fetch items');
      }
      return res;
    },
    ...defaultOptions
  });

  // Query for single item (reactive, by itemId)
  const itemQuery = useQuery({
    queryKey: [...queryKey, 'item', itemId],
    queryFn: async () => {
      if (!itemId) return null;
      const response = await httpClient.getById(itemId);
      if (!response.isSuccess) {
        throw new Error(response.message || 'Failed to fetch item');
      }
      return response;
    },
    enabled: !!itemId,
    ...defaultOptions
  });

  // Mutation for creating an item
  const createMutation = useMutation({
    mutationKey: [...queryKey, 'create'],
    mutationFn: async (data: TCreate) => {
      const res = await httpClient.create(data);
      if (!res.isSuccess) {
        throw new Error(res.message || 'Failed to create item');
      }
      return res;
    },
    onSuccess: (data) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey });
      setMessage(null);
    },
    onError: (error: Error) => {
      setMessage(error.message || 'Failed to create item');
    },
    retry: defaultOptions.retry
  });

  // Mutation for updating an item
  const updateMutation = useMutation({
    mutationKey: [...queryKey, 'update'],
    mutationFn: async ({ id, data }: { id: string; data: TUpdate }) => {
      const res = await httpClient.update(id, data);
      if (!res.isSuccess) {
        throw new Error(res.message || 'Failed to update item');
      }
      return res;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: [...queryKey, 'item', variables.id] });
      setMessage(null);
    },
    onError: (error: Error) => {
      setMessage(error.message || 'Failed to update item');
    },
    retry: defaultOptions.retry
  });

  // Mutation for deleting an item
  const removeMutation = useMutation({
    mutationKey: [...queryKey, 'remove'],
    mutationFn: async (id: string) => {
      const res = await httpClient.remove(id);
      if (!res.isSuccess) {
        throw new Error(res.message || 'Failed to delete item');
      }
      return res;
    },
    onSuccess: (data, id) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey });
      queryClient.removeQueries({ queryKey: [...queryKey, 'item', id] });
      setMessage(null);
    },
    onError: (error: Error) => {
      setMessage(error.message || 'Failed to delete item');
    },
    retry: defaultOptions.retry
  });

  /**
   * Imperative fetch for single item by ID. Returns the API response.
   * @param id - The item ID
   */
  const getById = async (id: string) => {
    try {
      const res = await queryClient.fetchQuery({
        queryKey: [...queryKey, 'item', id],
        queryFn: async () => {
          const response = await httpClient.getById(id);
          if (!response.isSuccess) {
            throw new Error(response.message || 'Failed to fetch item');
          }
          return response;
        },
        ...defaultOptions
      });
      return res;
    } catch (error: any) {
      setMessage(error.message || 'Failed to fetch item');
      throw error;
    }
  };

  /**
   * Imperative fetch for all items. Returns the API response.
   */

  const getAll = async () => {
    try {
      await itemsQuery.refetch();
      return itemsQuery.data || null;
    } catch (error: any) {
      setMessage(error.message || 'Failed to fetch items');
      throw error;
    }
  };

  /**
   * Helper to generate select options from all items.
   * @param labelPropertyName - property to use as label
   * @param valuePropertyName - property to use as value
   * @param placeholder - optional placeholder
   */

  const getSelectItems = async (
    labelPropertyName: string,
    valuePropertyName: string,
    placeholder?: string
  ) => {
    try {
      const data = itemsQuery.data?.payload?.content || [];
      if (data.length > 0) {
        const selectOptions = [
          {
            label: placeholder || 'Select any item',
            value: undefined,
          },
          ...(data.map((item: any) => ({
            label: item[labelPropertyName],
            value: item[valuePropertyName],
          })) as SelectOption[])
        ];
        setSelectItems(selectOptions);
        return selectOptions;
      }
      setSelectItems([]);
      return [];
    } catch (error: any) {
      setMessage(error.message || 'Unknown error');
      setSelectItems([]);
      return [];
    }
  };

  // Create item with mutation
  const create = async (data: TCreate) => {
    try {
      const result = await createMutation.mutateAsync(data);
      return result;
    } catch (error: any) {
      setMessage(error.message || 'Failed to create item');
      throw error;
    }
  };

  // Update item with mutation
  const update = async (id: string, data: TUpdate) => {
    try {
      const result = await updateMutation.mutateAsync({ id, data });
      return result;
    } catch (error: any) {
      setMessage(error instanceof Error ? error.message : 'Failed to update item');
      throw error;
    }
  };

  // Remove item with mutation
  const remove = async (id: string) => {
    try {
      const result = await removeMutation.mutateAsync(id);
      return result;
    } catch (error: any) {
      setMessage(error instanceof Error ? error.message : 'Failed to delete item');
      throw error;
    }
  };


  // Success flags (using mutation states)
  const isCreateSuccess = createMutation.isSuccess;
  const isUpdateSuccess = updateMutation.isSuccess;
  const isRemoveSuccess = removeMutation.isSuccess;

  // Loading states
  const isLoading = itemsQuery.isLoading || 
                   createMutation.isPending || 
                   updateMutation.isPending || 
                   removeMutation.isPending;

  return {
    // Data
    items: itemsQuery.data || null,
    item: itemQuery.data || null, // Single item is fetched reactively if itemId is provided
    selectItems,
    
    // Loading and message states
    isLoading,
    message,
    
    // Query states for more granular control
    itemsQuery,
    itemQuery,
    createMutation,
    updateMutation,
    removeMutation,
    
    // Functions
    getAll,
    getById,
    getSelectItems,
    create,
    update,
    remove,
    
    // Success flags
    isCreateSuccess,
    isUpdateSuccess,
    isRemoveSuccess,
    
    // Additional Tanstack Query utilities
    refetchItems: itemsQuery.refetch,
    invalidateQueries: () => queryClient.invalidateQueries({ queryKey }),
    
    // Setters for compatibility (no-ops)
    setItem: () => {},
    setItems: () => {},
    setSelectItems,
    setMessage,
  };

}