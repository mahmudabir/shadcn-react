import { RefObject, useCallback, useReducer, useRef, useState } from 'react';
import { useHttpClient } from '../api/use-http-client';
import { PagedData, Pagination } from '../models/pagination';
import { Result } from '../models/result';
import { SelectOption } from '../models/select-option';
import { generateSelectOptions } from './use-tanstack-view-model';
import { HttpOptions } from '../api/axios-request-config';

/* Enums */
enum ViewModelActionType {
  SetItems,
  SetItem,
  SetSelectItems,
  SetLoading,
  SetMessage,
  Reset,
}

/* Types */
type ViewModelState<T> = {
  items: Result<PagedData<T>> | null;
  item: Result<T> | null;
  selectItems: SelectOption[];
  isLoading: boolean;
  message: string | null;
};

type ViewModelAction<T> =
  | { type: ViewModelActionType.SetItems; payload: Result<PagedData<T>> | null }
  | { type: ViewModelActionType.SetItem; payload: Result<T> | null }
  | { type: ViewModelActionType.SetSelectItems; payload: SelectOption[] }
  | { type: ViewModelActionType.SetLoading; payload: boolean }
  | { type: ViewModelActionType.SetMessage; payload: string | null }
  | { type: ViewModelActionType.Reset };

/* Reducer */
function viewModelReducer<T>(state: ViewModelState<T>, action: ViewModelAction<T>): ViewModelState<T> {
  switch (action.type) {
    case ViewModelActionType.SetItems:
      return { ...state, items: action.payload };
    case ViewModelActionType.SetItem:
      return { ...state, item: action.payload };
    case ViewModelActionType.SetSelectItems:
      return { ...state, selectItems: action.payload };
    case ViewModelActionType.SetLoading:
      return { ...state, isLoading: action.payload };
    case ViewModelActionType.SetMessage:
      return { ...state, message: action.payload };
    case ViewModelActionType.Reset:
      return { ...state, items: null, item: null, message: null };
    default:
      return state;
  }
}

/* Hook */
export function useViewModel<
  T extends { id?: any },
  TQuery extends HttpOptions = HttpOptions,
  TCreate = T,
  TUpdate = T
>(
  apiBaseUrl: string
) {
  const [state, dispatch] = useReducer(viewModelReducer<T>, {
    items: null,
    item: null,
    selectItems: [],
    isLoading: false,
    message: null,
  });

  const http = useHttpClient<T, TQuery, TCreate, TUpdate>(apiBaseUrl);

  const controllerMapRef = useRef<Map<string, AbortController>>(new Map());

  function getSignalFor(key: string): AbortSignal {
    controllerMapRef.current.get(key)?.abort();
    const controller = new AbortController();

    // console.log('cancelRequest: ', key);
    // console.log('controllerMap: ', controllerMapRef.current);

    controllerMapRef.current.set(key, controller);
    return controller.signal;
  }

  function cancelRequest(key?: string) {
    if (key) {
      // console.log('cancelRequest: ', key);
      // console.log('controllerMap: ', controllerMapRef.current);

      controllerMapRef.current.get(key)?.abort();
      controllerMapRef.current.delete(key);
    } else {
      controllerMapRef.current.forEach((c) => c.abort());
      controllerMapRef.current.clear();
    }
  }

  /* Generic executor wrapper */
  const executeAsync = async <R>(
    operation: () => Promise<Result<R>>,
    onSuccess?: (res: Result<R>) => void
  ): Promise<Result<R> | null> => {
    dispatch({ type: ViewModelActionType.SetLoading, payload: true });
    dispatch({ type: ViewModelActionType.SetMessage, payload: null });
    try {
      const res = await operation();

      if (res.isSuccess && res.payload !== undefined) {
        onSuccess?.(res);
        return res;
      } else {
        dispatch({
          type: ViewModelActionType.SetMessage,
          payload: res?.message ?? 'Operation failed',
        });
        return res;
      }
    } catch (err: any) {

      // Axios abort error handling
      if (err.name === 'CanceledError' || err.message === 'canceled') {
        // Optional: you can log it or ignore silently
        console.warn('⛔ Request was cancelled. This should not be seen in the production.');
        return null;
      }

      dispatch({
        type: ViewModelActionType.SetMessage,
        payload: err?.message ?? 'Unexpected error occurred',
      });

      return null;
    } finally {
      dispatch({ type: ViewModelActionType.SetLoading, payload: false });
    }
  };

  const getAll = useCallback(async (query?: TQuery) => {
    const signal = getSignalFor(query?.queryKey);
    query.signal ??= signal;
    const result = await executeAsync(() => http.getAll(query), res => {
      dispatch({ type: ViewModelActionType.SetItems, payload: res });
    });
    return result;
  }, [http]);

  const getById = useCallback(async (id: string, query?: TQuery) => {
    const signal = getSignalFor(query?.queryKey);
    query.signal ??= signal;
    const result = await executeAsync(() => http.getById(id, query), res => {
      dispatch({ type: ViewModelActionType.SetItem, payload: res });
    });
    return result;
  }, [http]);

  const getSelectItems = useCallback(
    async (label: keyof T, value: keyof T, placeholder?: string, query?: TQuery) => {
      const signal = getSignalFor(query?.queryKey);
      query.signal ??= signal;
      const result = await executeAsync(() => {
        return http.getAll({ ...query, asDropdown: true })
      },
        (res) => {
          dispatch({ type: ViewModelActionType.SetItems, payload: res });
          dispatch({
            type: ViewModelActionType.SetSelectItems,
            payload: generateSelectOptions(res.payload!.content, label, value, placeholder),
          });
        }
      );
      return result;
    },
    [http]
  );

  const create = useCallback(async (data: TCreate, query?: TQuery) => {
    const signal = getSignalFor(query?.queryKey);
    query.signal ??= signal;
    const result = await executeAsync(() => {
      return http.create(data, query)
    },
      (res) => {
        dispatch({ type: ViewModelActionType.SetItem, payload: res });
      });
    return result;
  }, [http]);

  const update = useCallback(async (id: string, data: TUpdate, query?: TQuery) => {
    const signal = getSignalFor(query?.queryKey);
    query.signal ??= signal;
    const result = await executeAsync(
      () => {
        return http.update(id, data, query)
      },
      (res) => dispatch({ type: ViewModelActionType.SetItem, payload: res })
    );
    return result;
  }, [http]);

  const remove = useCallback(async (id: string, query?: TQuery) => {
    const signal = getSignalFor(query?.queryKey);
    query.signal ??= signal;
    const result = await executeAsync(
      () => {
        return http.remove(id, query)
      },
      () => dispatch({ type: ViewModelActionType.SetItem, payload: null })
    );
    return result;
  }, [http]);

  /* Public API */
  return {
    ...state,
    getAll,
    getById,
    getSelectItems,
    create,
    update,
    remove,
    cancelRequest,
    setItem: (item: Result<T> | null) => dispatch({ type: ViewModelActionType.SetItem, payload: item }),
    setItems: (items: Result<PagedData<T>> | null) => dispatch({ type: ViewModelActionType.SetItems, payload: items }),
    reset: () => dispatch({ type: ViewModelActionType.Reset }),
  };
}