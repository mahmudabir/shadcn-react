import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const QUERY_STATE_MINUTES = 5;
export const QUERY_STALE_TIME = 60 * 1000 * QUERY_STATE_MINUTES;
export const QUERY_RETRY = 3;
export const QUERY_REFETCH_ON_WINDOW_FOCUS = false;
