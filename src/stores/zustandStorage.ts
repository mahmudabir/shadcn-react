import * as idbKeyVal from 'idb-keyval';
import { createJSONStorage, StateStorage } from 'zustand/middleware';
import { QUERY_STALE_TIME_MS } from '@/lib/utils.ts';

type StoredData = {
  expiry: number;
  value: unknown;
};

const simpleIdbStorage: StateStorage = {
  getItem: async (name) => {
    const data = await idbKeyVal.get(name);
    return data ? JSON.stringify(data) : null;
  },
  setItem: async (name, value) => {
    await idbKeyVal.set(name, JSON.parse(value));
  },
  removeItem: async (name) => {
    await idbKeyVal.del(name);
  },
};

const idbStore = (expiryMs: number = 0): StateStorage => {
  return {
    getItem: async (name) => {
      const record = await idbKeyVal.get<StoredData>(name);
      if (!record) return null;

      const now = Date.now();

      // Check expiry
      if (record.expiry && now > record.expiry) {
        await idbKeyVal.del(name);
        return null; // Treat as no data
      }

      return JSON.stringify(record.value);
    },

    setItem: async (name, value) => {
      await idbKeyVal.set(name, {
        value: JSON.parse(value),
        expiry: Date.now() + expiryMs,
      });
    },

    removeItem: async (name) => {
      await idbKeyVal.del(name);
    },
  }
};

const createStateStorage = (storage: Storage, expiryMs: number = 0): StateStorage => {
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
        expiry: Date.now() + expiryMs,
      };
      storage.setItem(name, JSON.stringify(data));
    },

    removeItem: async (name) => {
      storage.removeItem(name);
    }
  }
};


export const zustandIndexedDBStorage = (expiryMs: number = QUERY_STALE_TIME_MS) => createJSONStorage(() => idbStore(expiryMs));
export const zustandStateStorage = (storage: Storage, expiryMs: number = QUERY_STALE_TIME_MS) => createJSONStorage(() => createStateStorage(storage, expiryMs));
