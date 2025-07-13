import { useEffect, useState, useCallback, useRef } from 'react';
import { ACCESS_TOKEN_KEY, TOKEN_CHANGE_EVENT } from "@/lib/authUtils.ts";

export const useAuthToken = () => {
  // Use a ref to track the current token state to avoid unnecessary re-renders
  const tokenStateRef = useRef(!!localStorage.getItem(ACCESS_TOKEN_KEY));
  const [hasToken, setHasToken] = useState(tokenStateRef.current);

  const onTokenChange = useCallback((event?: StorageEvent) => {
    // Only process if it's the custom event or if the storage event is related to our token
    if (!event || event.key === ACCESS_TOKEN_KEY || event.key === null) {
      const newTokenState = !!localStorage.getItem(ACCESS_TOKEN_KEY);

      // Only update state if the token status has actually changed
      if (tokenStateRef.current !== newTokenState) {
        tokenStateRef.current = newTokenState;
        setHasToken(newTokenState);
      }
    }
  }, []);

  useEffect(() => {
    // Use separate handlers for the different event types
    const storageHandler = (event: StorageEvent) => onTokenChange(event);
    const customEventHandler = () => onTokenChange();

    window.addEventListener('storage', storageHandler);
    window.addEventListener(TOKEN_CHANGE_EVENT, customEventHandler);

    return () => {
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener(TOKEN_CHANGE_EVENT, customEventHandler);
    };
  }, [onTokenChange]);

  return [hasToken, setHasToken] as const;
};
