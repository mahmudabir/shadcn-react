import { StateCreator } from "zustand";
import { QUERY_STALE_TIME_MS } from "@/lib/utils.ts";

export type BaseState<T> = {
    data: T;
    timestamp: number;
};

type WithLoggingAndExpiry = <T extends object & BaseState<any>>(
    config: StateCreator<T>
) => StateCreator<T>;

export const withLoggingAndExpiry: WithLoggingAndExpiry = (config) => (set, get, api) => {
    // Wrap `set`
    const loggingWithExpirySet: typeof set = (args: any, replace: any) => {
        const prev = get();
        set(args, replace);
        const next = get();

        console.groupCollapsed(
            "%c[Zustand Set]",
            "color:#4ade80; font-weight:bold;",
            new Date().toLocaleTimeString()
        );
        console.log("Previous:", prev);
        console.log("Applied:", args);
        console.log("Next:", next);
        console.groupEnd();
    };

    // Wrap `get`
    const loggingWithExpiryGet: typeof get = () => {
        const state = get();

        const isExpired = state.timestamp + QUERY_STALE_TIME_MS < Date.now();

        if (isExpired) {
            console.groupCollapsed(
                "%c[Zustand Expired]",
                "color:#f87171; font-weight:bold;",
                new Date().toLocaleTimeString()
            );
            console.log("Expired State:", state);
            console.groupEnd();

            set(() => ({ ...state, timestamp: 0, data: undefined } as any), true);
            return undefined; // or null
        }

        console.groupCollapsed(
            "%c[Zustand Get]",
            "color:#60a5fa; font-weight:bold;",
            new Date().toLocaleTimeString()
        );
        console.log("State:", state);
        console.groupEnd();

        return state;
    };

    return config(loggingWithExpirySet, loggingWithExpiryGet, api);
};
