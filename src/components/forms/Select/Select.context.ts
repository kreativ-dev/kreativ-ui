"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { InputVariant, InputSize } from "../Input/Input.types";

export interface SelectItemMeta {
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectContextValue {
  value?: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  variant: InputVariant;
  size: InputSize;
  rounded?: boolean;

  open: boolean;
  setOpen: (open: boolean) => void;

  triggerId: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  contentId: string;
  describedBy?: string;
  selectedLabel?: React.ReactNode;
  labelId: string | undefined;
  tabIndex?: number;

  required?: boolean;
  isInvalid: boolean;
  isSuccess: boolean;

  activeValue: string | undefined;
  setActiveValue: (value: string | undefined) => void;

  items: Map<string, SelectItemMeta>;
  registerItem: (value: string, meta: SelectItemMeta) => () => void;

  optionId: (value: string) => string;

  placeholder?: string;
  clearable: boolean;
  onClear: () => void;
}

export const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelectContext(componentName: string) {
  const ctx = useContext(SelectContext);
  if (!ctx) {
    throw new Error(`<${componentName} /> must be rendered inside <Select>.`);
  }
  return ctx;
}

export const SelectGroupContext = createContext<{
  labelId: string;
  setHasLabel: (id: string) => void;
} | null>(null);
