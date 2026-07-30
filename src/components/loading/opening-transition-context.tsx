/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from "react";

const OpeningTransitionContext = createContext(false);

interface OpeningTransitionProviderProps {
  active: boolean;
  children: ReactNode;
}

export function OpeningTransitionProvider({ active, children }: OpeningTransitionProviderProps) {
  return (
    <OpeningTransitionContext.Provider value={active}>{children}</OpeningTransitionContext.Provider>
  );
}

export function useOpeningTransitionActive() {
  return useContext(OpeningTransitionContext);
}
