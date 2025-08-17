import { get, set, del } from 'idb-keyval';
import { createJSONStorage, StateStorage } from 'zustand/middleware';
import { QUERY_STALE_TIME_MS } from '@/lib/utils.ts';

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

const createStateStorage = (storage: Storage): StateStorage => {
  return {
    getItem: async (name) => {
      const record = JSON.parse(storage.getItem(name)) as StoredData;
      if (!record) return null;

      const now = Date.now();

      // Check expiry
      if (record.expiry && now > record.expiry) {
        storage.removeItem(name);
        return null; // Treat as no data
      }

      return JSON.stringify(record.value);
    },

    setItem: async (name, value) => {
      const data: StoredData = {
        value: JSON.parse(value),
        expiry: Date.now() + QUERY_STALE_TIME_MS,
      };
      storage.setItem(name, JSON.stringify(data));
    },

    removeItem: async (name) => {
      storage.removeItem(name);
    }
  }
};


export const zustandIndexedDBStorage = () => createJSONStorage(() => idbStore);
export const zustandStateStorage = (storage: Storage) => createJSONStorage(() => createStateStorage((storage)));
