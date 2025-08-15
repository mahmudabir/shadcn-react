import { createContext, ReactNode, useContext, useState } from "react";

interface PreloaderContextType {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  increment: () => void;
  decrement: () => void;
  show: () => void;
  hide: () => void;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined);

export const PreloaderProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [counter, setCounter] = useState(0);

  // Manual control
  const show = () => {
    if (!visible) {
      setVisible(true);
    }
  };

  const hide = () => {
    if (!visible) return;
    setVisible(false);
  };

  // Auto mode: API call counter
  const increment = () => {
    setCounter((prev) => {
      if (prev === 0) {
        setVisible(true);
      }
      return prev + 1;
    });
  };

  const decrement = () => {
    setCounter((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setVisible(false);
        return 0;
      }
      return next;
    });
  };

  return (
    <PreloaderContext.Provider value={{ visible, setVisible, increment, decrement, show, hide }}>
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
