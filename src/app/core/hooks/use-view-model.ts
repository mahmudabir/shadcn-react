import { useReducer, useRef } from "react";
import { useHttpClient } from "../api/http-client";
import { PagedData } from "../models/pagination";
import { Result } from "../models/result";
import { SelectOption } from "../models/select-option";

enum ViewModelActionType {
    SetItems = "SET_ITEMS",
    SetItem = "SET_ITEM",
    SetSelectItems = "SET_SELECT_ITEMS",
    SetLoading = "SET_LOADING",
    SetMessage = "SET_MESSAGE",
    Reset = "RESET",
}

type State<T> = {
    items: Result<PagedData<T>> | null;
    item: Result<T> | null;
    selectItems: SelectOption[];
    isLoading: boolean;
    message: string | null;
};

type Action<T> = | { type: ViewModelActionType; payload?: any };

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
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

/**
 * Generic CRUD ViewModel hook for any entity API
 */
export function useViewModel<T, TCreate = Omit<T, 'id'>, TUpdate = Omit<T, 'id'>>(apiBaseUrl) {
    const [state, dispatch] = useReducer(reducer<T>, {
        items: null,
        item: null,
        selectItems: [],
        isLoading: false,
        message: null,
    });

    const isCreateSuccess = useRef(false);
    const isUpdateSuccess = useRef(false);
    const isRemoveSuccess = useRef(false);

    const httpClient = useHttpClient<T, TCreate, TUpdate>(apiBaseUrl);

    const getAll = async () => {
        dispatch({ type: ViewModelActionType.SetLoading, payload: true });
        dispatch({ type: ViewModelActionType.SetMessage, payload: null });
        try {
            const res = await httpClient.getAll();
            if (res.isSuccess && res.payload) {
                dispatch({ type: ViewModelActionType.SetItems, payload: res });
            } else {
                dispatch({ type: ViewModelActionType.SetMessage, payload: res.message || "Failed to fetch items" });
            }
        } catch (e: any) {
            dispatch({ type: ViewModelActionType.SetMessage, payload: e.message || "Unknown error" });
        } finally {
            dispatch({ type: ViewModelActionType.SetLoading, payload: false });
        }
    };

    const getById = async (id: string) => {
        dispatch({ type: ViewModelActionType.SetLoading, payload: true });
        dispatch({ type: ViewModelActionType.SetMessage, payload: null });
        try {
            const res = await httpClient.getById(id);
            if (res.isSuccess && res.payload) {
                dispatch({ type: ViewModelActionType.SetItem, payload: res });
            } else {
                dispatch({ type: ViewModelActionType.SetMessage, payload: res.message || "Failed to fetch item" });
            }
        } catch (e: any) {
            dispatch({ type: ViewModelActionType.SetMessage, payload: e.message || "Unknown error" });
        } finally {
            dispatch({ type: ViewModelActionType.SetLoading, payload: false });
        }
    };

    const getSelectItems = async (labelPropertyName: string, valuePropertyName: string, placeholder?: string) => {
        dispatch({ type: ViewModelActionType.SetLoading, payload: true });
        dispatch({ type: ViewModelActionType.SetMessage, payload: null });

        try {
            if (state.items) {
                dispatch({ type: ViewModelActionType.SetSelectItems, payload: generateSelectItems(state.items.payload.content) });
                return;
            }
            const res = await httpClient.getAll({ skipPreloader: true, asDropdown: true });
            if (res.isSuccess && res.payload) {
                dispatch({ type: ViewModelActionType.SetItems, payload: res });
                dispatch({ type: ViewModelActionType.SetSelectItems, payload: generateSelectItems(res?.payload?.content) });
            } else {
                dispatch({ type: ViewModelActionType.SetMessage, payload: res.message || "Failed to fetch items" });
            }
        } catch (e: any) {
            dispatch({ type: ViewModelActionType.SetMessage, payload: e.message || "Unknown error" });
        } finally {
            dispatch({ type: ViewModelActionType.SetLoading, payload: false });
        }

        function generateSelectItems(data: T[] = []): SelectOption[] {
            return [
                {
                    label: placeholder || 'Select any item',
                    value: undefined,
                },
                ...(data?.map(item => ({
                    label: item[labelPropertyName],
                    value: String(item[valuePropertyName]),
                })) ?? [])
            ]
        };
    };

    const create = async (data: TCreate) => {
        dispatch({ type: ViewModelActionType.SetLoading, payload: true });
        dispatch({ type: ViewModelActionType.SetMessage, payload: null });
        try {
            const res = await httpClient.create(data);
            if (res.isSuccess) {
                dispatch({ type: ViewModelActionType.SetItem, payload: res });
                isCreateSuccess.current = true;
            } else {
                dispatch({ type: ViewModelActionType.SetMessage, payload: res.message || "Failed to create item" });
                isCreateSuccess.current = false;
            }
        } catch (e: any) {
            dispatch({ type: ViewModelActionType.SetMessage, payload: e.message || "Unknown error" });
            isCreateSuccess.current = false;
        } finally {
            dispatch({ type: ViewModelActionType.SetLoading, payload: false });
        }
    };

    const update = async (id: string, data: TUpdate) => {
        dispatch({ type: ViewModelActionType.SetLoading, payload: true });
        dispatch({ type: ViewModelActionType.SetMessage, payload: null });
        try {
            const res = await httpClient.update(id, data);
            if (res.isSuccess) {
                dispatch({ type: ViewModelActionType.SetItem, payload: res });
                isUpdateSuccess.current = true;
            } else {
                dispatch({ type: ViewModelActionType.SetMessage, payload: res.message || "Failed to update item" });
                isUpdateSuccess.current = false;
            }
        } catch (e: any) {
            dispatch({ type: ViewModelActionType.SetMessage, payload: e.message || "Unknown error" });
            isUpdateSuccess.current = false;
        } finally {
            dispatch({ type: ViewModelActionType.SetLoading, payload: false });
        }
    };

    const remove = async (id: string) => {
        dispatch({ type: ViewModelActionType.SetLoading, payload: true });
        dispatch({ type: ViewModelActionType.SetMessage, payload: null });
        try {
            const res = await httpClient.remove(id);
            if (res.isSuccess) {
                dispatch({ type: ViewModelActionType.SetItem, payload: null });
                isRemoveSuccess.current = true;
            } else {
                dispatch({ type: ViewModelActionType.SetMessage, payload: res.message || "Failed to delete item" });
                isRemoveSuccess.current = false;
            }
        } catch (e: any) {
            dispatch({ type: ViewModelActionType.SetMessage, payload: e.message || "Unknown error" });
            isRemoveSuccess.current = false;
        } finally {
            dispatch({ type: ViewModelActionType.SetLoading, payload: false });
        }
    };

    return {
        ...state,
        getAll,
        getById,
        getSelectItems,
        create,
        isCreateSuccess,
        update,
        isUpdateSuccess,
        remove,
        isRemoveSuccess,
        setItem: (item: Result<T> | null) => dispatch({ type: ViewModelActionType.SetItem, payload: item }),
        setItems: (items: Result<PagedData<T>> | null) => dispatch({ type: ViewModelActionType.SetItems, payload: items }),
    };
}