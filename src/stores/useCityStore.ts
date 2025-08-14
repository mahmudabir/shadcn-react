import { create } from "zustand";
import { persist } from "zustand/middleware";
import { City } from "@/app/modules/city-tanstack/models/city.ts";
import { devtools } from 'zustand/middleware'

interface CityState {
    citiesByCountry: Record<string, City[]>; // countryId -> list of cities
    addCity: (countryId: string, city: City) => void;
    removeCity: (countryId: string, cityId: string) => void;
    updateCity: (countryId: string, cityId: string, updated: Partial<City>) => void;
    setCities: (countryId: string, cities: City[]) => void;
    clearCities: (countryId: string) => void;
}

export const useCityStore = create<CityState>()(
    devtools(
        persist(
            (set) => ({
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
                name: "city-storage", // key in localStorage
                partialize: (state) => ({ citiesByCountry: state.citiesByCountry }), // only store relevant state
            }
        )
    )
);
