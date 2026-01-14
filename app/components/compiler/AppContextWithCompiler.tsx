"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  contextValue: number;
  setContextValue: (value: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProviderWithCompiler({ children }: { children: ReactNode }) {
  const [contextValue, setContextValue] = useState(() => {
    console.log("🔵 AppContext (Compiler): useState initializer ran");
    return 0;
  });

  return (
    <AppContext.Provider value={{ contextValue, setContextValue }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContextWithCompiler() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContextWithCompiler must be used within AppContextProviderWithCompiler");
  }
  return context;
}

