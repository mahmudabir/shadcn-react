import React, { createContext, ReactNode, useContext, useRef, useState } from "react";

interface PreloaderContextType {
  visible: boolean;
  increment: () => void;
  decrement: () => void;
  setManual: (manual: boolean) => void;
  show: () => void;
  hide: () => void;
  isManual: boolean;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined);
const MinimumVisibilityMs = 150; // Minimum visibility time for the preloader

export const PreloaderProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [showTimestamp, setShowTimestamp] = useState<number | null>(null);
  const [counter, setCounter] = useState(0);
  const [isManual, setIsManual] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  // Manual control
  const show = () => {
    setIsManual(true);
    if (!visible) {
      setVisible(true);
      setShowTimestamp(Date.now());
    }
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  };
  const hide = () => {
    setIsManual(true);
    if (!visible) return;
    const now = Date.now();
    if (showTimestamp !== null) {
      const elapsed = now - showTimestamp;
      if (elapsed < 1000) {
        hideTimeout.current = setTimeout(() => {
          setVisible(false);
          setShowTimestamp(null);
          hideTimeout.current = null;
        }, 1000 - elapsed);
        return;
      }
    }
    setVisible(false);
    setShowTimestamp(null);
  };

  // Auto mode: API call counter
  const increment = () => {
    setIsManual(false);
    setCounter((prev) => {
      if (prev === 0) {
        setVisible(true);
        setShowTimestamp(Date.now());
      }
      return prev + 1;
    });
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  };
  const decrement = () => {
    setIsManual(false);
    setCounter((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        const now = Date.now();
        if (showTimestamp !== null) {
          const elapsed = now - showTimestamp;
          if (elapsed < MinimumVisibilityMs) {
            hideTimeout.current = setTimeout(() => {
              setVisible(false);
              setShowTimestamp(null);
              hideTimeout.current = null;
            }, MinimumVisibilityMs - elapsed);
            return 0;
          }
        }
        setVisible(false);
        setShowTimestamp(null);
        return 0;
      }
      return next;
    });
  };

  const setManual = (manual: boolean) => {
    setIsManual(manual);
  };

  React.useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  return (
    <PreloaderContext.Provider value={{ visible, increment, decrement, setManual, show, hide, isManual }}>
      {children}
    </PreloaderContext.Provider>
  );
};

export const usePreloader = () => {
  const context = useContext(PreloaderContext);
  if (!context) {
    throw new Error("usePreloader must be used within a PreloaderProvider");
  }
  return context;
};
