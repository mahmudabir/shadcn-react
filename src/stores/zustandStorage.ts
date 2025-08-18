import * as idbKeyVal from 'idb-keyval';
import { createJSONStorage, StateStorage } from 'zustand/middleware';
import { QUERY_STALE_TIME_MS } from '@/lib/utils.ts';
import { PersistStorage } from "zustand/middleware/persist";

type StoredData = {
  expiry: number;
  value: unknown;
};

export enum StorageType {
  LocalStorage = 'LocalStorage',
  SessionStorage = 'SessionStorage',
  IndexedDb = 'IndexedDb',
}

const indexedDbStore = (expiryMs: number = 0): PersistStorage<any> => createJSONStorage(() => ({
  getItem: async (name) => {
    const record = await idbKeyVal.get<StoredData>(name);
    if (!record) return null;

    // Check expiry
    if (record.expiry && Date.now() > record.expiry) {
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
}));

const createStateStorage = (storage: Storage, expiryMs: number = 0): PersistStorage<any> => createJSONStorage(() => ({
  getItem: async (name) => {
    const record = JSON.parse(storage.getItem(name)) as StoredData;
    if (!record) return null;

    // Check expiry
    if (record.expiry && Date.now() > record.expiry) {
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
}));

export const zustandStateStorage = (storageType: StorageType, expiryMs: number = QUERY_STALE_TIME_MS): PersistStorage<any> => {
  switch (storageType) {
    case StorageType.IndexedDb:
      return indexedDbStore(expiryMs);
    case StorageType.LocalStorage:
      return createStateStorage(localStorage, expiryMs);
    case StorageType.SessionStorage:
    default:
      return createStateStorage(sessionStorage, expiryMs);
  }
};
