import * as React from "react";

import {
  RepeaterRootContext,
  RepeaterRootContextValue,
} from "./Repeater.context";
import { useControllableState } from "@/hooks";
import { isDev } from "@/utils/env";

export interface RepeaterRootProps<T> {
  value?: T[];
  defaultValue?: T[];
  onValueChange?: (value: T[]) => void;
  getKey?: (item: T, index: number) => string;
  children: React.ReactNode;
}

export function defaultGetKey<T>(item: T, index: number): string {
  if (item && typeof item === "object" && "id" in item) {
    const id = (item as Record<string, unknown>).id;

    if (id != null) {
      return String(id);
    }
  }

  if (isDev()) {
    console.warn(
      "[kreativ-ui/Repeater.Root]: no stable key could be derived for an item. " +
        "Falling back to array index as the key, which can cause incorrect " +
        "reconciliation on reorder/remove. Provide a `getKey` that derives " +
        "a stable id from each item.",
    );
  }

  return String(index);
}

export function RepeaterRoot<T>({
  value: controlledValue,
  defaultValue,
  onValueChange,
  getKey = defaultGetKey,
  children,
}: RepeaterRootProps<T>) {
  const [value, setValue] = useControllableState<T[]>({
    value: controlledValue,
    defaultValue: defaultValue ?? [],
    onChange: onValueChange,
  });

  const remove = React.useCallback(
    (index: number) => {
      setValue(value.filter((_, i) => i !== index));
    },
    [value, setValue],
  );

  const moveUp = React.useCallback(
    (index: number) => {
      if (index <= 0) return;
      const next = value.slice();
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      setValue(next);
    },
    [value, setValue],
  );

  const moveDown = React.useCallback(
    (index: number) => {
      if (index >= value.length - 1) return;

      const next = value.slice();

      [next[index], next[index + 1]] = [next[index + 1], next[index]];

      setValue(next);
    },
    [value, setValue],
  );

  const insert = React.useCallback(
    (item: T, position: number | "append" | "prepend") => {
      if (position === "append") {
        setValue([...value, item]);
        return;
      }

      if (position === "prepend") {
        setValue([item, ...value]);
        return;
      }

      const next = value.slice();
      next.splice(position, 0, item);
      setValue(next);
    },
    [value, setValue],
  );

  const contextValue = React.useMemo<RepeaterRootContextValue<T>>(
    () => ({
      value,
      getKey,
      remove,
      moveUp,
      moveDown,
      insert,
    }),
    [value, getKey, remove, moveUp, moveDown, insert],
  );

  return (
    <RepeaterRootContext.Provider value={contextValue}>
      {children}
    </RepeaterRootContext.Provider>
  );
}
