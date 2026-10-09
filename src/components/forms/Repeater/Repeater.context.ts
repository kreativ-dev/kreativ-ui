import * as React from "react";

export interface RepeaterRootContextValue<T = unknown> {
  value: T[];
  remove: (index: number) => void;
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
  insert: (item: T, position: number | "append" | "prepend") => void;
  getKey: (item: T, index: number) => string;
}

export const RepeaterRootContext = React.createContext<RepeaterRootContextValue<any> | null>(
  null
);

export function useRequiredRepeaterRootContext<T = unknown>(
  partName: string
): RepeaterRootContextValue<T> {
  const ctx = React.useContext(RepeaterRootContext);
  if (!ctx) {
    throw new Error(`<${partName} /> must be rendered inside <Repeater> or <Repeater.Root>.`);
  }
  return ctx as RepeaterRootContextValue<T>;
}

export interface RepeaterItemContextValue {
  index: number;
}

export const RepeaterItemContext = React.createContext<RepeaterItemContextValue | null>(null);

export function useRequiredRepeaterItemContext(partName: string): RepeaterItemContextValue {
  const ctx = React.useContext(RepeaterItemContext);
  if (!ctx) {
    throw new Error(`<${partName} /> must be rendered inside <Repeater.Item>.`);
  }
  return ctx;
}
