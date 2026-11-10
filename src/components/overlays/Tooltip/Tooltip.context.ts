import * as React from "react";
import type {
  Placement,
  useFloating,
  useInteractions,
} from "@floating-ui/react";

type Interactions = ReturnType<typeof useInteractions>;
type Floating = ReturnType<typeof useFloating>;

export interface TooltipRootContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  refs: Floating["refs"];
  floatingStyles: React.CSSProperties;
  floatingContext: Floating["context"];
  getReferenceProps: Interactions["getReferenceProps"];
  getFloatingProps: Interactions["getFloatingProps"];
  /** Resolved placement AFTER flip/shift — drives data-side and arrow orientation. */
  placement: Placement;
  arrowRef: React.MutableRefObject<HTMLElement | null>;
  arrow: { x?: number; y?: number };
}

export const TooltipContext =
  React.createContext<TooltipRootContextValue | null>(null);

export function useTooltipContext(part: string): TooltipRootContextValue {
  const ctx = React.useContext(TooltipContext);
  if (!ctx)
    throw new Error(`<${part}> must be rendered inside <Tooltip.Root>.`);
  return ctx;
}

export type TooltipDelay = number | { open?: number; close?: number };

/** Present only inside <TooltipProvider>. Root is fully functional without it. */
export interface TooltipProviderValue {
  delay: TooltipDelay;
}
export const TooltipProviderContext =
  React.createContext<TooltipProviderValue | null>(null);
