"use client";

import type { RequiredStateControlProps, ValueProps } from "@/types";
import { createContext, useContext, type RefObject } from "react";

export interface ComboboxItemMeta {
  label: React.ReactNode;
  disabled?: boolean;
  visible: boolean;
}

export interface ComboboxContextValue
  extends
    ValueProps<string | undefined, true>,
    RequiredStateControlProps<string, "inputValue">,
    RequiredStateControlProps<boolean, "open">,
    RequiredStateControlProps<string | undefined, "activeValue"> {
  disabled: boolean;
  triggerId: string;
  contentId: string;
  triggerRef: RefObject<HTMLInputElement | null>;
  isInvalid: boolean;
  isSuccess?: boolean;
  isWarning?: boolean;
  rounded?: boolean;
  describedBy?: string;
  setItemVisibility: (value: string, visible: boolean) => void;
  items: Map<string, ComboboxItemMeta>;
  registerItem: (value: string, meta: ComboboxItemMeta) => () => void;
  unregisterItem: (value: string) => void;
  optionId: (value: string) => string;
}

export const ComboboxContext = createContext<ComboboxContextValue | null>(null);

export function useComboboxContext(componentName: string) {
  const ctx = useContext(ComboboxContext);
  if (!ctx)
    throw new Error(`<${componentName} /> must be rendered inside <Combobox>.`);
  return ctx;
}
