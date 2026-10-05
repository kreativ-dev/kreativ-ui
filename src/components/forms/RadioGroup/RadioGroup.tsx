"use client";

import { useCallback, useId, useState } from "react";
import { cn } from "@/utils/cn";
import { useOptionalFormField } from "../FormField/FormField.context";
import { RadioGroupContext } from "./RadioGroup.context";
import type { RadioGroupProps } from "./RadioGroup.types";

export function RadioGroup({
  value: valueProp,
  defaultValue,
  onValueChange,
  name: nameProp,
  disabled = false,
  required = false,
  orientation = "vertical",
  size = "md",
  error,
  success,
  className,
  children,
}: RadioGroupProps) {
  const autoName = useId();
  const name = nameProp ?? autoName;
  const field = useOptionalFormField();

  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;

  const handleValueChange = useCallback(
    (next: string) => {
      if (valueProp === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const isInvalid = error ?? field?.invalid ?? false;
  const isSuccess = success ?? false;
  const state = isInvalid ? "error" : isSuccess ? "success" : "none";
  const groupRequired = required || !!field?.required;

  return (
    <RadioGroupContext.Provider
      value={{
        name,
        value,
        onValueChange: handleValueChange,
        disabled,
        size,
        state,
        groupRequired,
      }}
    >
      <div
        role="radiogroup"
        aria-labelledby={
          field?.hasExternalLabel ? `${field.id}-label` : undefined
        }
        aria-describedby={field?.describedBy}
        aria-required={groupRequired || undefined}
        aria-invalid={isInvalid || undefined}
        className={cn(
          "flex gap-3",
          orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col",
          className,
        )}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}
