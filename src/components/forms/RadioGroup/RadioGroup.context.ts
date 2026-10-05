"use client";

import { createContext, useContext } from "react";
import type { RadioSize } from "./Radio.types";

export interface RadioGroupContextValue {
  name: string;
  value?: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  size: RadioSize;
  state: "none" | "error" | "success";
  groupRequired: boolean;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function useRadioGroupContext() {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error("<Radio /> must be rendered inside <RadioGroup>.");
  }
  return ctx;
}