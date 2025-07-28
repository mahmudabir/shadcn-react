import { useRef, useState } from "react";
import { useHttpClient } from "../api/http-client";
import { PagedData } from "../models/pagination";
import { Result } from "../models/result";
import { SelectOption } from "../models/select-option";

/**
 * Generic CRUD ViewModel hook for any entity API
 */
export function useViewModel<T, TCreate = Omit<T, 'id'>, TUpdate = Omit<T, 'id'>>(apiBaseUrl) {
    const [items, setItems] = useState<Result<PagedData<T>> | null>(null);
    const [item, setItem] = useState<Result<T> | null>(null);
    const [selectItems, setSelectItems] = useState<SelectOption[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const isCreateSuccess = useRef(false);
    const isUpdateSuccess = useRef(false);
    const isRemoveSuccess = useRef(false);

    const [message, setMessage] = useState<string | null>(null);

    const httpClient = useHttpClient<T, TCreate, TUpdate>(apiBaseUrl);

    const getAll = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            const res = await httpClient.getAll();
            if (res.isSuccess && res.payload) {
                setItems(res);
            } else {
                setMessage(res.message || "Failed to fetch items");
            }
        } catch (e: any) {
            setMessage(e.message || "Unknown error");
        } finally {
            setIsLoading(false);
        }
    };

    const getById = async (id: string) => {
        setIsLoading(true);
        setMessage(null);
        try {
            const res = await httpClient.getById(id);
            if (res.isSuccess && res.payload) {
                setItem(res);
            } else {
                setMessage(res.message || "Failed to fetch item");
            }
        } catch (e: any) {
            setMessage(e.message || "Unknown error");
        } finally {
            setIsLoading(false);
        }
    };

    const getSelectItems = async (labelPropertyName: string, valuePropertyName: string, placeholder?: string) => {
        setIsLoading(true);
        setMessage(null);

        const generateSelectItems = (data: T[] = []): SelectOption[] => {
            return [
                {
                    label: placeholder || 'Select any item',
                    value: undefined,
                },
                ...(data?.map(item => ({
                    label: item[labelPropertyName],
                    value: String(item[valuePropertyName]),
                })) ?? [])
            ];
        };

        try {
            if (items) {
                setSelectItems(generateSelectItems(items.payload.content));
                return;
            }
            const res = await httpClient.getAll({ skipPreloader: true, asDropdown: true });
            if (res.isSuccess && res.payload) {
                setItems(res);
                setSelectItems(generateSelectItems(res?.payload?.content));
            } else {
                setMessage(res.message || "Failed to fetch items");
            }
        } catch (e: any) {
            setMessage(e.message || "Unknown error");
        } finally {
            setIsLoading(false);
        }
    };

    const create = async (data: TCreate) => {
        setIsLoading(true);
        setMessage(null);
        try {
            const res = await httpClient.create(data);
            if (res.isSuccess) {
                setItem(res);
                isCreateSuccess.current = true;
            } else {
                setMessage(res.message || "Failed to create item");
                isCreateSuccess.current = false;
            }
        } catch (e: any) {
            setMessage(e.message || "Unknown error");
            isCreateSuccess.current = false;
        } finally {
            setIsLoading(false);
        }
    };

    const update = async (id: string, data: TUpdate) => {
        setIsLoading(true);
        setMessage(null);
        try {
            const res = await httpClient.update(id, data);
            if (res.isSuccess) {
                setItem(res);
                isUpdateSuccess.current = true;
            } else {
                setMessage(res.message || "Failed to update item");
                isUpdateSuccess.current = false;
            }
        } catch (e: any) {
            setMessage(e.message || "Unknown error");
            isUpdateSuccess.current = false;
        } finally {
            setIsLoading(false);
        }
    };

    const remove = async (id: string) => {
        setIsLoading(true);
        setMessage(null);
        try {
            const res = await httpClient.remove(id);
            if (res.isSuccess) {
                setItem(null);
                isRemoveSuccess.current = true;
            } else {
                setMessage(res.message || "Failed to delete item");
                isRemoveSuccess.current = false;
            }
        } catch (e: any) {
            setMessage(e.message || "Unknown error");
            isRemoveSuccess.current = false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        items,
        item,
        selectItems,
        isLoading,
        message,
        getAll,
        getById,
        getSelectItems,
        create,
        isCreateSuccess,
        update,
        isUpdateSuccess,
        remove,
        isRemoveSuccess,
        setItem,
        setItems,
    };
}
