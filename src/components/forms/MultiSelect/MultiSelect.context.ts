"use client";

import { createContext, useContext, type RefObject } from "react";
import type { InputVariant, InputSize } from "../Input/Input.types";

export interface MultiSelectItemMeta {
  label: React.ReactNode;
  disabled?: boolean;
}

export interface MultiSelectContextValue {
  value: string[];
  toggleValue: (v: string) => void;
  removeValue: (v: string) => void;
  disabled: boolean;
  variant: InputVariant;
  size: InputSize;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  contentId: string;
  triggerRef: RefObject<HTMLDivElement | null>;
  isInvalid: boolean;
  isSuccess?: boolean;
  describedBy?: string;
  required?: boolean;
  placeholder?: string;
  maxVisibleChips?: number;
  activeValue: string | undefined;
  setActiveValue: (v: string | undefined) => void;
  items: Map<string, MultiSelectItemMeta>;
  registerItem: (value: string, meta: MultiSelectItemMeta) => () => void;
  optionId: (value: string) => string;
  onClear: () => void;
  rounded?: boolean;
  clearable?: boolean;
}

export const MultiSelectContext = createContext<MultiSelectContextValue | null>(
  null,
);

export function useMultiSelectContext(componentName: string) {
  const ctx = useContext(MultiSelectContext);
  if (!ctx)
    throw new Error(
      `<${componentName} /> must be rendered inside <MultiSelect>.`,
    );
  return ctx;
}
