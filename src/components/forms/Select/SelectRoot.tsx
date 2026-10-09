"use client";

import * as React from "react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { composeRefs, createComponent } from "@splenddev/kreativ-core";

import { SelectContext } from "./Select.context";
import type { SelectRootProps } from "./Select.types";
import { useOptionalFormField } from "../FormField/FormField.context";
import { cn } from "@/utils";

export const SelectRoot = createComponent<SelectRootProps, HTMLDivElement>({
  displayName: "Select.Root",
  __kui: {
    role: "formControl",
    formControl: "compound",
    skeleton: "input-shaped",
    video: {
      id: "select",
      safe: true,
      acceptsChildren: true,
      interactionStates: ["focus"],
      controlled: ["value"],
      motionGated: true,
    },
  },
  render: (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      disabled = false,
      required,
      name,
      variant = "outline",
      size = "md",
      className,
      placeholder,
      "aria-describedby": ariaDescribedBy,
      clearable = false,
      error,
      success,
      tabIndex,
      rounded,
      children,
    },
    ref,
  ) => {
    const autoId = useId();
    const field = useOptionalFormField();
    const triggerId = field?.id ?? autoId;
    const triggerRef = useRef<HTMLDivElement>(null);
    const contentId = `${triggerId}-listbox`;
    const labelId = field?.labelId;

    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = valueProp !== undefined ? valueProp : internalValue;

    const isDisabled = disabled || Boolean(field?.disabled);
    const isInvalid = error || field?.invalid || false;
    const isSuccess = success && !isInvalid ? true : false;
    const describedBy = field?.describedBy ?? ariaDescribedBy;
    const isRequired = field?.required ?? required;
    const fieldName = name ?? field?.name;

    const [open, setOpen] = useState(false);
    const [activeValue, setActiveValue] = useState<string | undefined>(value);
    const [selectedLabel, setSelectedLabel] = useState<React.ReactNode>();

    const itemsRef = useRef<
      Map<string, { label: React.ReactNode; disabled?: boolean }>
    >(new Map());
    const [items, setItems] = useState<
      Map<string, { label: React.ReactNode; disabled?: boolean }>
    >(new Map());

    const registerItem = useCallback(
      (val: string, meta: { label: React.ReactNode; disabled?: boolean }) => {
        itemsRef.current.set(val, meta);
        setItems(new Map(itemsRef.current));
        return () => {
          itemsRef.current.delete(val);
          setItems(new Map(itemsRef.current));
        };
      },
      [],
    );

    const handleValueChange = useCallback(
      (val: string) => {
        const label = itemsRef.current.get(val)?.label ?? val;
        setSelectedLabel(label);
        if (valueProp === undefined) {
          setInternalValue(val);
        }
        onValueChange?.(val);
        setOpen(false);
      },
      [valueProp, onValueChange],
    );

    const handleClear = useCallback(() => {
      setActiveValue(undefined);
      setInternalValue(undefined);
      onValueChange?.(undefined);
      setSelectedLabel(undefined);
    }, [onValueChange]);

    const optionId = useCallback(
      (val: string) => `${contentId}-option-${val}`,
      [contentId],
    );

    useEffect(() => {
      if (open) setActiveValue(value);
    }, [open, value]);

    useEffect(() => {
      if (value !== undefined) {
        const label = itemsRef.current.get(value)?.label;
        if (label !== undefined) setSelectedLabel(label);
      }
    }, [value, items]);

    const rootRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!open) return;
      function handlePointerDown(e: MouseEvent) {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handlePointerDown);
      return () => document.removeEventListener("mousedown", handlePointerDown);
    }, [open]);

    const ctxValue = useMemo(
      () => ({
        value,
        selectedLabel,
        onValueChange: handleValueChange,
        disabled: isDisabled,
        variant,
        size,
        open,
        setOpen,
        triggerId,
        contentId,
        labelId,
        isInvalid,
        isSuccess,
        describedBy,
        required: isRequired,
        activeValue,
        setActiveValue,
        items,
        registerItem,
        optionId,
        placeholder,
        clearable,
        onClear: handleClear,
        triggerRef,
        rounded,
        tabIndex,
      }),
      [
        value,
        items,
        selectedLabel,
        handleValueChange,
        isDisabled,
        variant,
        size,
        open,
        triggerId,
        contentId,
        isInvalid,
        isSuccess,
        describedBy,
        isRequired,
        activeValue,
        registerItem,
        optionId,
        placeholder,
        clearable,
        handleClear,
        triggerRef,
        rounded,
        labelId,
        tabIndex,
      ],
    );

    return (
      <SelectContext.Provider value={ctxValue}>
        <div
          ref={composeRefs(rootRef, ref)}
          className={cn("relative inline-block w-full", className)}
        >
          {children}
          {fieldName && (
            <input
              type="hidden"
              name={fieldName}
              value={value ?? ""}
              disabled={isDisabled}
              required={isRequired}
            />
          )}
        </div>
      </SelectContext.Provider>
    );
  },
});