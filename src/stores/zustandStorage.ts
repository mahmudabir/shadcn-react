import { get, set, del } from 'idb-keyval';
import { createJSONStorage, StateStorage } from 'zustand/middleware';
import { QUERY_STALE_TIME_MS } from '../lib/utils';

type StoredData = {
    expiry: number;
    value: unknown;
};

const simpleIdbStorage: StateStorage = {
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

const idbStore: StateStorage = {
    getItem: async (name) => {
        const record = await get<StoredData>(name);
        if (!record) return null;

        const now = Date.now();

        // Check expiry
        if (record.expiry && now > record.expiry) {
            await del(name);
            return null; // Treat as no data
        }

        return JSON.stringify(record.value);
    },

    setItem: async (name, value) => {
        await set(name, {
            value: JSON.parse(value),
            expiry: Date.now() + QUERY_STALE_TIME_MS,
        });
    },

    removeItem: async (name) => {
        await del(name);
    },
};

const localStore: StateStorage = {
    getItem: async (name) => {
        const record = JSON.parse(localStorage.getItem(name)) as StoredData;
        if (!record) return null;

        const now = Date.now();

        // Check expiry
        if (record.expiry && now > record.expiry) {
            localStorage.removeItem(name);
            return null; // Treat as no data
        }

        return JSON.stringify(record.value);
    },

    setItem: async (name, value) => {
        const data: StoredData = {
            value: JSON.parse(value),
            expiry: Date.now() + QUERY_STALE_TIME_MS,
        };
        localStorage.setItem(name, JSON.stringify(data));
    },

    removeItem: async (name) => {
        localStorage.removeItem(name);
    },
};

const sessionStore: StateStorage = {
    getItem: async (name) => {
        const record = JSON.parse(sessionStorage.getItem(name)) as StoredData;
        if (!record) return null;

        const now = Date.now();

        // Check expiry
        if (record.expiry && now > record.expiry) {
            sessionStorage.removeItem(name);
            return null; // Treat as no data
        }

        return JSON.stringify(record.value);
    },

    setItem: async (name, value) => {
        const data: StoredData = {
            value: JSON.parse(value),
            expiry: Date.now() + QUERY_STALE_TIME_MS,
        };
        sessionStorage.setItem(name, JSON.stringify(data));
    },

    removeItem: async (name) => {
        sessionStorage.removeItem(name);
    },
};


export const zustandIndexedDBStorage = createJSONStorage(() => idbStore);
export const zustandLocalStorage = createJSONStorage(() => localStore);
export const zustandSessionStorage = createJSONStorage(() => sessionStore);
