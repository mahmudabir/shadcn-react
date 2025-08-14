import { get, set, del } from 'idb-keyval';
import { createJSONStorage, StateStorage } from 'zustand/middleware';

const idbStorage: StateStorage = {
    getItem: async (name) => {
        const data = await get(name);
        return data ? JSON.stringify(data) : null;
    },
    setItem: async (name, value) => {
        await set(name, JSON.parse(value));
    },
    removeItem: async (name) => {
        await del(name);
    },
};

export const indexedDBStorage = createJSONStorage(() => idbStorage);
