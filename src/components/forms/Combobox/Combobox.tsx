"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useOptionalFormField } from "../FormField/FormField.context";
import { ComboboxContext, type ComboboxItemMeta } from "./Combobox.context";
import type { ComboboxProps } from "./Combobox.types";
import { ComboboxInput } from "./ComboboxInput";
import { ComboboxItem } from "./ComboboxItem";
import { ComboboxContent } from "./ComboboxContent";
import { ComboboxEmpty } from "./ComboboxEmpty";
import { ComboboxLoading } from "./ComboboxLoading";

export function Combobox({
  value,
  onValueChange,
  inputValue: inputValueProp,
  defaultInputValue = "",
  onInputChange,
  disabled = false,
  name,
  error,
  success,
  rounded,
  className,
  status,
  children,
}: ComboboxProps) {
  const autoId = useId();
  const field = useOptionalFormField();
  const triggerId = field?.id ?? autoId;
  const contentId = `${triggerId}-listbox`;

  const isInvalid = error || field?.invalid || false;
  const isSuccess = success && !isInvalid ? true : false;

  const [internalInput, setInternalInput] = useState(defaultInputValue);
  const inputValue =
    inputValueProp !== undefined ? inputValueProp : internalInput;

  function setInputValue(v: string) {
    if (inputValueProp === undefined) setInternalInput(v);
    onInputChange?.(v);
  }

  const [open, setOpen] = useState(false);
  const [activeValue, setActiveValue] = useState<string | undefined>(undefined);

  const itemsRef = useRef<Map<string, ComboboxItemMeta>>(new Map());
  const [items, setItems] = useState<Map<string, ComboboxItemMeta>>(new Map());

  const registerItem = useCallback((value: string, meta: ComboboxItemMeta) => {
    const item = {
      ...meta,
      visible: true,
    };

    itemsRef.current.set(value, item);

    setItems((prev) => {
      const next = new Map(prev);
      next.set(value, item);
      return next;
    });

    return () => unregisterItem(value);
  }, []);

  function setItemVisibility(value: string, visible: boolean) {
    setItems((prev) => {
      const item = prev.get(value);

      if (!item || item.visible === visible) {
        return prev;
      }

      const next = new Map(prev);
      next.set(value, {
        ...item,
        visible,
      });

      return next;
    });

    const item = itemsRef.current.get(value);

    if (item) {
      itemsRef.current.set(value, {
        ...item,
        visible,
      });
    }
  }
  function unregisterItem(value: string) {
    setItems((prev) => {
      if (!prev.has(value)) return prev;

      const next = new Map(prev);
      next.delete(value);

      return next;
    });

    itemsRef.current.delete(value);
  }

  const triggerRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!value) {
      setInputValue("");
      return;
    }

    const item = itemsRef.current.get(value);

    if (item && !open) {
      setInputValue(String(item.label));
    }
  }, [value, open]);

  const ctxValue = useMemo(
    () => ({
      value,
      defaultValue: "",
      inputValue,
      setInputValue,
      onValueChange: (v: string | undefined) => {
        onValueChange?.(v);

        const item = v ? itemsRef.current.get(v) : undefined;

        if (item) {
          setInputValue(String(item.label));
        }

        setOpen(false);
      },
      disabled,
      open,
      setOpen,
      triggerId,
      contentId,
      triggerRef,
      isInvalid,
      isSuccess,
      describedBy: field?.describedBy,
      activeValue,
      setActiveValue,
      items,
      registerItem,
      rounded,
      optionId,
      setItemVisibility,
      unregisterItem,
    }),
    [
      value,
      inputValue,
      onValueChange,
      disabled,
      open,
      triggerId,
      contentId,
      field?.invalid,
      field?.describedBy,
      activeValue,
      registerItem,
      optionId,
      success,
      rounded,
      items,
      setItemVisibility,
      unregisterItem,
    ],
  );

  return (
    <ComboboxContext.Provider value={ctxValue}>
      <div ref={rootRef} className={className ?? "relative w-full"}>
        {children}
        {name && (
          <input
            type="hidden"
            name={name}
            value={value ?? ""}
            disabled={disabled}
          />
        )}
      </div>
    </ComboboxContext.Provider>
  );
}

Combobox.Input = ComboboxInput;
Combobox.Item = ComboboxItem;
Combobox.Content = ComboboxContent;
Combobox.Empty = ComboboxEmpty;
Combobox.Loading = ComboboxLoading;
