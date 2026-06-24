"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type ViewMode = "human" | "machine";

interface ViewModeContextValue {
  mode: ViewMode;
  toggle: () => void;
}

const ViewModeContext = createContext<ViewModeContextValue>({
  mode: "human",
  toggle: () => {},
});

export function useViewMode() {
  return useContext(ViewModeContext);
}

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ViewMode>("human");
  const toggle = useCallback(
    () => setMode((m) => (m === "human" ? "machine" : "human")),
    []
  );
  return (
    <ViewModeContext.Provider value={{ mode, toggle }}>
      {children}
    </ViewModeContext.Provider>
  );
}
