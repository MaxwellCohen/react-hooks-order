"use client";
"use no memo";
import { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  contextValue: number;
  setContextValue: (value: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  "use no memo";
  const [contextValue, setContextValue] = useState(() => {
    console.log("🔵 AppContext: useState initializer ran");
    return 0;
  });

  return (
    <AppContext.Provider value={{ contextValue, setContextValue }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }
  return context;
}

