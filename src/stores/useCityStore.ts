import { create } from "zustand";
import { persist } from "zustand/middleware";
import { City } from "@/app/modules/city-tanstack/models/city.ts";
import { devtools } from 'zustand/middleware'
import { zustandStateStorage } from "./zustandStorage";

interface CityState {
  citiesByCountry: Record<any, City[]>; // countryId -> list of cities
  addCity: (countryId: string, city: City) => void;
  removeCity: (countryId: string, cityId: string) => void;
  updateCity: (countryId: string, cityId: string, updated: Partial<City>) => void;
  setCities: (countryId: string, cities: City[]) => void;
  clearCities: (countryId: string) => void;
}

export const useCityStore: () => CityState = create<CityState>()(
  devtools(
    persist(
      (set, get) => ({
        citiesByCountry: {},

        addCity: (countryId, city) =>
          set((state) => ({
            citiesByCountry: {
              ...state.citiesByCountry,
              [countryId]: [...(state.citiesByCountry[countryId] || []), city],
            },
          })),

        removeCity: (countryId, cityId) =>
          set((state) => ({
            citiesByCountry: {
              ...state.citiesByCountry,
              [countryId]: (state.citiesByCountry[countryId] || []).filter(
                (c) => c.id !== cityId
              ),
            },
          })),

        updateCity: (countryId, cityId, updated) =>
          set((state) => ({
            citiesByCountry: {
              ...state.citiesByCountry,
              [countryId]: (state.citiesByCountry[countryId] || []).map((c) =>
                c.id === cityId ? { ...c, ...updated } : c
              ),
            },
          })),

        setCities: (countryId, cities) =>
          set((state) => ({
            citiesByCountry: { ...state.citiesByCountry, [countryId]: cities },
          })),

        clearCities: (countryId) =>
          set((state) => {
            const newData = { ...state.citiesByCountry };
            delete newData[countryId];
            return { citiesByCountry: newData };
          }),
      }),
      {
        name: "city-storage", // key in storage
        partialize: (state: CityState) => ({ citiesByCountry: state.citiesByCountry }), // only store relevant state
        storage: zustandStateStorage(localStorage),
      }
    )
  )
);
