import { createContext, useContext } from "react";

export const OverlayRootContext = createContext<HTMLElement | null>(null);

export function useOverlayRoot() {
  return useContext(OverlayRootContext);
}
