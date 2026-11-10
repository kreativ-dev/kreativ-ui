"use client";

import { createPortal } from "react-dom";
import { useOverlayRoot } from "./overlay.context";

export function OverlayPortal({ children }: { children: React.ReactNode }) {
  const root = useOverlayRoot();

  if (typeof document === "undefined") return null;

  return createPortal(children, root ?? document.body);
}
