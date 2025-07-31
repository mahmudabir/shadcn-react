import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const QUERY_STALE_TIME = 0;//5 * 60 * 1000; // 5 minutes
export const QUERY_RETRY = 0;
export const QUERY_REFETCH_ON_WINDOW_FOCUS = true;
