"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useOptionalFormField } from "../FormField/FormField.context";
import {
  MultiSelectContext,
  type MultiSelectItemMeta,
} from "./MultiSelect.context";
import type { MultiSelectProps } from "./MultiSelect.types";
import { MultiSelectTrigger } from "./MultiSelectTrigger";
import { MultiSelectContent } from "./MultiSelectContent";
import { MultiSelectItem } from "./MultiSelectItem";

export function MultiSelect({
  value: valueProp,
  defaultValue = [],
  onValueChange,
  disabled = false,
  required,
  name,
  variant = "outline",
  size = "md",
  placeholder,
  maxVisibleChips,
  className,
  children,
  error,
  success,
  rounded,
  clearable,
}: MultiSelectProps) {
  const autoId = useId();
  const field = useOptionalFormField();
  const triggerId = field?.id ?? autoId;
  const contentId = `${triggerId}-listbox`;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;

  const [open, setOpen] = useState(false);
  const [activeValue, setActiveValue] = useState<string | undefined>(undefined);

  const itemsRef = useRef<Map<string, MultiSelectItemMeta>>(new Map());
  const [, forceUpdate] = useReducer((n) => n + 1, 0);

  const registerItem = useCallback((val: string, meta: MultiSelectItemMeta) => {
    itemsRef.current.set(val, meta);
    forceUpdate();
    return () => {
      itemsRef.current.delete(val);
      forceUpdate();
    };
  }, []);

  const commit = useCallback(
    (next: string[]) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const toggleValue = useCallback(
    (v: string) =>
      commit(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]),
    [value, commit],
  );
  const removeValue = useCallback(
    (v: string) => commit(value.filter((x) => x !== v)),
    [value, commit],
  );

  const handleClear = useCallback(() => {
    commit([]);
  }, [commit]);

  const triggerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const optionId = useCallback(
    (val: string) => `${contentId}-option-${val}`,
    [contentId],
  );

  const ctxValue = useMemo(
    () => ({
      value,
      toggleValue,
      removeValue,
      disabled,
      variant,
      size,
      open,
      setOpen,
      triggerId,
      contentId,
      triggerRef,
      isInvalid: field?.invalid ?? error ?? false,
      describedBy: field?.describedBy,
      required: field?.required ?? required,
      placeholder,
      maxVisibleChips,
      activeValue,
      setActiveValue,
      items: itemsRef.current,
      registerItem,
      optionId,
      isSuccess: success,
      rounded,
      clearable,
      onClear: handleClear,
    }),
    [
      value,
      toggleValue,
      removeValue,
      disabled,
      variant,
      size,
      open,
      triggerId,
      contentId,
      field?.invalid,
      field?.describedBy,
      field?.required,
      required,
      placeholder,
      maxVisibleChips,
      activeValue,
      registerItem,
      optionId,
      error,
      success,
      rounded,
      clearable,
      handleClear,
    ],
  );

  return (
    <MultiSelectContext.Provider value={ctxValue}>
      <div ref={rootRef} className={className ?? "relative w-full"}>
        {children}
        {name &&
          value.map((v) => (
            <input
              key={v}
              type="hidden"
              name={`${name}[]`}
              value={v}
              disabled={disabled}
            />
          ))}
      </div>
    </MultiSelectContext.Provider>
  );
}

MultiSelect.Trigger = MultiSelectTrigger;
MultiSelect.Content = MultiSelectContent;
MultiSelect.Item = MultiSelectItem;
