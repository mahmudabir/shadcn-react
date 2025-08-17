import { create } from "zustand";
import { persist } from "zustand/middleware";
import { City } from "@/app/modules/city-tanstack/models/city.ts";
import { devtools } from 'zustand/middleware'
import { zustandStateStorage } from "./zustandStorage";
import { BaseState, withLoggingAndExpiry } from "@/stores/middlewares/withLoggingAndExpiry.ts";

interface CityState extends BaseState<Record<any, City[]>> {
    getCitiesByCountry: () => Record<any, City[]>; // countryId -> list of cities
    addCity: (countryId: string, city: City) => void;
    removeCity: (countryId: string, cityId: string) => void;
    updateCity: (countryId: string, cityId: string, updated: Partial<City>) => void;
    setCities: (countryId: string, cities: City[]) => void;
    clearCities: (countryId: string) => void;
}

export const useCityStore: () => Omit<CityState, 'data' | 'timestamp'> = create<CityState>()(
    devtools(
        persist(
            withLoggingAndExpiry(
                (set, get, api) => ({
                    data: {},
                    timestamp: Date.now(),

                    getCitiesByCountry: () => {
                        return get()?.data ?? {}
                    },

                    addCity: (countryId, city) => {
                        set((state: CityState) => ({
                            data: {
                                ...state.data,
                                [countryId]: [...(state.data[countryId] || []), city],
                            },
                            timestamp: Date.now(),
                        }));
                    },

                    updateCity: (countryId, cityId, updated) => {
                        set((state: CityState) => ({
                            data: {
                                ...state.data,
                                [countryId]: (state.data[countryId] || []).map((c) =>
                                    c.id === cityId ? { ...c, ...updated } : c
                                ),
                            },
                            timestamp: Date.now(),
                        }));
                    },

                    removeCity: (countryId, cityId) => {
                        set((state: CityState) => ({
                            data: {
                                ...state.data,
                                [countryId]: (state.data[countryId] || []).filter(
                                    (c) => c.id !== cityId
                                ),
                            },
                            timestamp: Date.now(),
                        }));
                    },

                    setCities: (countryId, cities) => {
                        set((state: CityState) => ({
                            data: { ...state.data, [countryId]: cities },
                            timestamp: Date.now(),
                        }));
                    },

                    clearCities: (countryId) => {
                        set((state: CityState) => {
                            const newData = { ...state.data };
                            delete newData[countryId];
                            return {
                                data: newData,
                                timestamp: Date.now(),
                            };
                        });
                    },
                })
            ),
            {
                name: "city-storage", // key in storage
                partialize: (state: CityState) => ({ data: state.data, timestamp: state.timestamp }), // only store relevant state
                storage: zustandStateStorage(localStorage),
            }
        )
    )
);
