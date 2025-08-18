import { useCallback, useEffect, useRef } from "react";

export const useDebounce = (callback: () => void | (() => void), deps: any[], delay: number = 0) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const debouncedCallback = useCallback(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Run any existing cleanup function
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    
    timeoutRef.current = setTimeout(() => {
      const result = callback();
      // Store cleanup function if callback returns one
      if (typeof result === 'function') {
        cleanupRef.current = result;
      }
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    debouncedCallback();
    return () => {
      // Clean up timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Run cleanup function if exists
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, deps);
};