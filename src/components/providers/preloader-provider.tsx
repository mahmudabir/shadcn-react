import { createContext, ReactNode, useContext, useState } from "react";

interface PreloaderContextType {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  increment: () => void;
  decrement: () => void;
  setManual: (manual: boolean) => void;
  show: () => void;
  hide: () => void;
  isManual: boolean;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined);

export const PreloaderProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isManual, setIsManual] = useState(false);

  // Manual control
  const show = () => {
    setIsManual(true);
    if (!visible) {
      setVisible(true);
    }
  };

  const hide = () => {
    setIsManual(true);
    if (!visible) return;
    setVisible(false);
  };

  // Auto mode: API call counter
  const increment = () => {
    setIsManual(false);
    setCounter((prev) => {
      if (prev === 0) {
        setVisible(true);
      }
      return prev + 1;
    });
  };

  const decrement = () => {
    setIsManual(false);
    setCounter((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setVisible(false);
        return 0;
      }
      return next;
    });
  };

  const setManual = (manual: boolean) => {
    setIsManual(manual);
  };

  return (
    <PreloaderContext.Provider value={{ visible, setVisible, increment, decrement, setManual, show, hide, isManual }}>
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
