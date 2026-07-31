import { createContext, useContext, type ReactNode } from "react";

const OpeningTransitionContext = createContext(false);

/** true enquanto a capa/intro ainda está ativa (hold + abertura). */
export function OpeningTransitionProvider({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <OpeningTransitionContext.Provider value={active}>{children}</OpeningTransitionContext.Provider>
  );
}

export function useOpeningTransitionActive() {
  return useContext(OpeningTransitionContext);
}
