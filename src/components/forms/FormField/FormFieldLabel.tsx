"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useFormField } from "./FormField.context";
import { cn } from "@/utils";

export function FormFieldLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const field = useFormField();

  useEffect(() => {
    return field.registerLabel();
  }, [field]);

  return (
    <label
      id={field.labelId}
      htmlFor={field.id}
      className={cn("font-medium text-text text-sm", className)}
    >
      {children}
      {field.required && (
        <span aria-hidden className="ml-1 text-destructive">
          *
        </span>
      )}
    </label>
  );
}
