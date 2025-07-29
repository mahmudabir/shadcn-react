import { useReducer, useRef, useCallback } from 'react';
import { useHttpClient } from '../api/use-http-client';
import { Result } from '../models/result';
import { PagedData } from '../models/pagination';
import { SelectOption } from '../models/select-option';

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
      return { ...state, item: null, message: null };
    default:
      return state;
  }
}

/* Reusable Select Generator */
const generateSelectOptions = <T>(items: T[], labelKey: keyof T, valueKey: keyof T, placeholder?: string): SelectOption[] => {
  return [
    { label: placeholder ?? 'Select an option', value: undefined },
    ...items.map(item => ({
      label: String(item[labelKey]),
      value: String(item[valueKey]),
    })),
  ];
};

/* Hook */
export function useViewModel<T extends { id?: any }, TCreate, TUpdate>(apiBaseUrl: string) {
  const [state, dispatch] = useReducer(viewModelReducer<T>, {
    items: null,
    item: null,
    selectItems: [],
    isLoading: false,
    message: null,
  });

  const http = useHttpClient<T, TCreate, TUpdate>(apiBaseUrl);

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
      dispatch({
        type: ViewModelActionType.SetMessage,
        payload: err?.message ?? 'Unexpected error occurred',
      });
      return null;
    } finally {
      dispatch({ type: ViewModelActionType.SetLoading, payload: false });
    }
  };

  const getAll = useCallback(async () => {
    const result = await executeAsync(() => http.getAll(), res => {
      dispatch({ type: ViewModelActionType.SetItems, payload: res });
    });
    return result;
  }, [http]);

  const getById = useCallback(async (id: string) => {
    const result = await executeAsync(() => http.getById(id), res => {
      dispatch({ type: ViewModelActionType.SetItem, payload: res });
    });
    return result;
  }, [http]);

  const getSelectItems = useCallback(
    async (label: keyof T, value: keyof T, placeholder?: string) => {
      const result = await executeAsync(
        () => http.getAll({ skipPreloader: true, asDropdown: true }),
        res => {
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

  const create = useCallback(async (data: TCreate) => {
    const result = await executeAsync(() => http.create(data), res => {
      dispatch({ type: ViewModelActionType.SetItem, payload: res });
    });
    return result;
  }, [http]);

  const update = useCallback(async (id: string, data: TUpdate) => {
    const result = await executeAsync(
      () => http.update(id, data),
      res => dispatch({ type: ViewModelActionType.SetItem, payload: res })
    );
    return result;
  }, [http]);

  const remove = useCallback(async (id: string) => {
    const result = await executeAsync(
      () => http.remove(id),
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
    setItem: (item: Result<T> | null) => dispatch({ type: ViewModelActionType.SetItem, payload: item }),
    setItems: (items: Result<PagedData<T>> | null) => dispatch({ type: ViewModelActionType.SetItems, payload: items }),
    reset: () => dispatch({ type: ViewModelActionType.Reset }),
  };
}